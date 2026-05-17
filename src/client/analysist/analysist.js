import React, { useEffect, useRef, useState } from "react";
import { analysistImg, chatWithMedicalRag } from "../../axios/analy";
import { useSelector } from "react-redux";
import SaveInfor from "./saveInfor";

const sampleResult = {
    recommendation: "Bạn có thể tham khảo thêm các ca bệnh tương tự ở phần trợ lý AI.",
};

const starterQuestions = [
    "Bệnh nhân nam 47 tuổi, bị glioma, area 1200",
    "Bệnh nhân nữ 35 tuổi, bị meningioma, area 980",
    "Bệnh nhân nam 29 tuổi, bị pituitary tumor, area 760",
];

const initialMessages = [];

const createThreadId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `thread-${Date.now()}`;
};

const createMessage = (role, content) => ({
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
});

const isListLine = (line) => /^([-*â€¢]\s+|\d+\.\s+)/.test(line.trim());

const cleanListLine = (line) => line.replace(/^([-*â€¢]\s+|\d+\.\s+)/, "").trim();

function MessageContent({ role, content }) {
    if (role !== "assistant") {
        return <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{content}</p>;
    }

    const lines = String(content)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (!lines.length) {
        return <p>Không có nội dung.</p>;
    }

    const blocks = [];
    let paragraphBuffer = [];
    let listBuffer = [];

    const flushParagraphs = () => {
        if (paragraphBuffer.length) {
            blocks.push({ type: "paragraph", content: paragraphBuffer.join(" ") });
            paragraphBuffer = [];
        }
    };

    const flushList = () => {
        if (listBuffer.length) {
            blocks.push({ type: "list", items: [...listBuffer] });
            listBuffer = [];
        }
    };

    lines.forEach((line) => {
        if (isListLine(line)) {
            flushParagraphs();
            listBuffer.push(cleanListLine(line));
            return;
        }

        flushList();
        paragraphBuffer.push(line);
    });

    flushParagraphs();
    flushList();

    return (
        <div className="space-y-3">
            {blocks.map((block, index) => {
                if (block.type === "list") {
                    return (
                        <div key={`list-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                            <ul className="space-y-2">
                                {block.items.map((item, itemIndex) => (
                                    <li key={`${item}-${itemIndex}`} className="flex items-start gap-2">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                return (
                    <p key={`paragraph-${index}`} className="leading-7 text-slate-700">
                        {block.content}
                    </p>
                );
            })}
        </div>
    );
}

export default function Analysist() {

    const name = useSelector((state) => state.user.user.name);

    const fileInputRef = useRef(null);
    const chatViewportRef = useRef(null);
    const expandedChatViewportRef = useRef(null);
    const chatInputRef = useRef(null);
    const expandedChatInputRef = useRef(null);
    const threadIdRef = useRef(createThreadId());

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState(initialMessages);
    const [rsDetect, setRsDetect] = useState("");
    const [rsFromImg, setRsFromImg] = useState(null);
    const [isChatting, setIsChatting] = useState(false);
    const [pendingAnalysis, setPendingAnalysis] = useState(false);
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [chatStatus, setChatStatus] = useState("Sẵn sàng");
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [savedPatientInfo, setSavedPatientInfo] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (chatViewportRef.current) {
            chatViewportRef.current.scrollTop = chatViewportRef.current.scrollHeight;
        }

        if (expandedChatViewportRef.current) {
            expandedChatViewportRef.current.scrollTop = expandedChatViewportRef.current.scrollHeight;
        }
    }, [messages, pendingAnalysis, isChatting]);

    useEffect(() => {
        const resizeTextarea = (element, maxHeight) => {
            if (!element) return;
            element.style.height = "auto";
            element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
            element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden";
        };

        resizeTextarea(chatInputRef.current, 120);
        resizeTextarea(expandedChatInputRef.current, 180);
    }, [chatInput, isChatExpanded]);

    useEffect(() => {
        if (!isChatExpanded) return undefined;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsChatExpanded(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isChatExpanded]);

    const resetConversation = () => {
        threadIdRef.current = createThreadId();
        setMessages(initialMessages);
        setChatInput("");
        setPendingAnalysis(false);
        setChatStatus("Sẵn sàng");
    };

    const handleOpenSaveModal = () => {
        if (!hasResult) return;
        setIsSaveModalOpen(true);
    };

    const handleCloseSaveModal = () => {
        setIsSaveModalOpen(false);
    };

    const handleSavePatientInfo = (formData) => {
        setSavedPatientInfo(formData);
    };

    const buildInitialSaveData = () => {
        const detectedClass = String(rsFromImg?.class_and_confidence?.class || "").toLowerCase();

        let defaultType = "Glioma";
        if (detectedClass.includes("meningioma")) {
            defaultType = "Meningioma";
        } else if (detectedClass.includes("pituitary")) {
            defaultType = "Pituitary Tumor";
        }

        return {
            patientType: savedPatientInfo?.patientType || "new",
            name: savedPatientInfo?.name || "",
            address: savedPatientInfo?.address || "",
            age: savedPatientInfo?.age || "",
            phone: savedPatientInfo?.phone || "",
            gender: savedPatientInfo?.gender || "male",
            area: savedPatientInfo?.area || rsFromImg?.tumor_area_pixel || "",
            description: savedPatientInfo?.description || "",
            nameType: savedPatientInfo?.nameType || defaultType,
        };
    };

    const handleSelectFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setHasResult(false);
        setRsDetect("");
        setRsFromImg(null);
        resetConversation();
    };

    const handleAnalyze = async () => {
        if (!selectedFile || isAnalyzing) return;

        setIsAnalyzing(true);
        setHasResult(false);

        try {
            const rs = await analysistImg(selectedFile);
            const imageData = rs.data;

            setRsDetect(`${imageData.id_img}${imageData.name_file}`);
            setRsFromImg(imageData);
            setHasResult(true);
            setChatStatus("Đã có kết quả ảnh, sẵn sàng hỏi RAG");
            setMessages((current) => [
                ...current,
                createMessage(
                    "assistant",
                    "Ảnh đã được phân tích. Bạn có thể nhập thông tin bệnh nhân theo mẫu: 'Bệnh nhân nam 47 tuổi, bị glioma, area 1200'."
                ),
            ]);
        } catch (error) {
            console.error("Analyze image failed:", error);
            setChatStatus("Phân tích ảnh thất bại");
            setMessages((current) => [
                ...current,
                createMessage(
                    "assistant",
                    "Không thể phân tích ảnh lúc này. Vui lòng kiểm tra API segment-tumor và thử lại."
                ),
            ]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const pushAssistantReply = (data) => {
        const nextMessages = [createMessage("assistant", data.answer || "Không có dữ liệu phản hồi.")];

        if (data.ask_for_analysis && data.analysis_prompt) {
            nextMessages.push(createMessage("assistant", data.analysis_prompt));
        }

        setMessages((current) => [...current, ...nextMessages]);
    };

    const handleSendMessage = async (question) => {
        const content = (question || chatInput).trim();
        if (!content || isChatting) return;

        setMessages((current) => [...current, createMessage("user", content)]);
        setChatInput("");
        setIsChatting(true);
        setPendingAnalysis(false);
        setChatStatus("Đang gửi câu hỏi tới RAG");

        try {
            const rs = await chatWithMedicalRag({
                question: content,
                thread_id: threadIdRef.current,
            });

            const data = rs.data;
            pushAssistantReply(data);
            setPendingAnalysis(Boolean(data.ask_for_analysis));
            setChatStatus(data.ask_for_analysis ? "Đang chờ xác nhận phân tích ưu, nhược" : "Đã nhận phản hồi");
        } catch (error) {
            console.error("Chat request failed:", error);
            const detail = error?.response?.data?.detail;
            setMessages((current) => [
                ...current,
                createMessage(
                    "assistant",
                    detail || "Không thể gọi API chat. Vui lòng kiểm tra backend /chat rồi thử lại."
                ),
            ]);
            setChatStatus("Gọi chat thất bại");
        } finally {
            setIsChatting(false);
        }
    };

    const handleAnalysisReply = async (choice) => {
        if (isChatting || !pendingAnalysis) return;

        setMessages((current) => [...current, createMessage("user", choice === "co" ? "có" : "không")]);
        setIsChatting(true);
        setPendingAnalysis(false);
        setChatStatus("Đang xử lý lựa chọn phân tích");

        try {
            const rs = await chatWithMedicalRag({
                thread_id: threadIdRef.current,
                dif: choice,
            });

            const data = rs.data;
            pushAssistantReply(data);
            setChatStatus(
                data.status === "analysis_skipped" ? "Đã bỏ qua bước phân tích" : "Đã nhận phân tích ưu, nhược"
            );
        } catch (error) {
            console.error("Analysis choice failed:", error);
            const detail = error?.response?.data?.detail;
            setMessages((current) => [
                ...current,
                createMessage(
                    "assistant",
                    detail || "Không thể gửi lựa chọn phân tích. Vui lòng thử lại."
                ),
            ]);
            setChatStatus("Gửi lựa chọn phân tích thất bại");
        } finally {
            setIsChatting(false);
        }
    };

    const renderMessageList = (viewportRef, heightClass, expanded = false) => (
        <div
            ref={viewportRef}
            className={`${expanded ? "flex-1 min-h-0 px-4 pb-6 pt-4 md:px-8" : "mt-5 h-[460px] rounded-[28px] border border-slate-200 bg-slate-50/70 p-4"} flex flex-col gap-4 overflow-y-auto ${heightClass || ""}`}
        >
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`${expanded ? "mx-auto w-full max-w-4xl" : "w-full"} flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                    <div
                        className={`min-w-0 max-w-[88%] whitespace-pre-wrap break-words rounded-[24px] px-4 py-3 text-sm leading-7 [overflow-wrap:anywhere] ${message.role === "assistant"
                            ? "border border-slate-200 bg-white text-slate-700 shadow-sm"
                            : "bg-cyan-600 text-white shadow-sm shadow-cyan-900/10"
                            } ${expanded ? "md:max-w-[72%]" : ""}`}
                    >
                        <MessageContent role={message.role} content={message.content} />
                    </div>
                </div>
            ))}

            {isChatting ? (
                <div className={`${expanded ? "mx-auto w-full max-w-4xl" : "w-full"} flex justify-start`}>
                    <div className="min-w-0 max-w-[88%] rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm md:max-w-[72%]">
                        Đang nhận phản hồi từ trợ lý...
                    </div>
                </div>
            ) : null}
        </div>
    );

    const renderPendingAnalysisCard = () =>
        pendingAnalysis ? (
            <div className="mt-4 rounded-[24px] border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-cyan-900">
                    Bạn có muốn phân tích ưu, nhược điểm của các phương pháp này không?
                </p>
                <div className="mt-3 flex gap-3">
                    <button
                        type="button"
                        onClick={() => handleAnalysisReply("co")}
                        disabled={isChatting}
                        className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Có
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAnalysisReply("khong")}
                        disabled={isChatting}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Không
                    </button>
                </div>
            </div>
        ) : null;

    const renderComposer = (expanded = false) => (
        <div
            className={`${expanded ? "sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 pb-4 pt-3 backdrop-blur md:px-8" : "mt-4"}`}
        >
            <div className={`${expanded ? "mx-auto max-w-4xl" : ""} rounded-[24px] border border-slate-200 bg-white p-3 shadow-lg`}>
                <textarea
                    rows={1}
                    ref={expanded ? expandedChatInputRef : chatInputRef}
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Nhập câu hỏi hoặc thông tin bệnh nhân, ví dụ: Bệnh nhân nam 47 tuổi, bị glioma, area 1200"
                    className={`w-full resize-none border-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400 ${expanded ? "min-h-[44px] max-h-[180px] text-sm leading-6" : "min-h-[42px] max-h-[120px] text-sm leading-6"}`}
                />
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                    <p className="text-xs text-slate-400">
                        API chat dùng cùng endpoint `/chat`. Hãy giữ nguyên phiên chat để trả lời bước phân tích tiếp theo.
                    </p>
                    <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={isChatting}
                        className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Gửi câu hỏi
                    </button>
                </div>
            </div>
        </div>
    );

    const renderChatPanel = ({ expanded = false, viewportRef, heightClass }) => {
        const showStarters = messages.length === 0;

        return (
            <div
                className={expanded ? "flex h-full w-full flex-col bg-slate-50" : "rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"}
            >
                <div className={expanded ? "border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8" : "flex items-start justify-between gap-4 border-b border-slate-100 pb-4"}>
                    <div className={expanded ? "mx-auto flex w-full max-w-4xl items-start justify-between gap-4" : "flex w-full items-start justify-between gap-4"}>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-700">RAG Support</p>
                            <h2 className={`mt-1 font-bold text-slate-900 ${expanded ? "text-2xl" : "text-xl"}`}>Trợ lý giải thích kết quả</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Hỗ trợ bác sĩ diễn giải kết quả và đối chiếu thông tin bệnh nhân nhanh hơn.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsChatExpanded((current) => !current)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                            >
                                {expanded ? "Thu nhỏ" : "Phóng to"}
                            </button>
                            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                {isChatting ? "Đang xử lý" : "Online"}
                            </div>
                        </div>
                    </div>
                </div>

                {showStarters ? (
                    <div className={expanded ? "mx-auto mt-4 w-full max-w-4xl px-4 md:px-8" : "mt-4"}>
                        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Xin chào, {name || "bác sĩ"}</p>
                                    <p className="mt-1 text-xs leading-6 text-slate-500">
                                        Nhập hồ sơ bệnh nhân hoặc chọn câu hỏi mẫu để bắt đầu trao đổi.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetConversation}
                                    className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                                >
                                    Tạo phiên chat mới
                                </button>
                            </div>

                            {/* {showStarters ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {starterQuestions.map((question) => (
                                        <button
                                            key={question}
                                            type="button"
                                            onClick={() => handleSendMessage(question)}
                                            disabled={isChatting}
                                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            ) : null} */}
                        </div>
                    </div>
                ) : null}

                {renderMessageList(viewportRef, heightClass, expanded)}
                <div className={expanded ? "mx-auto w-full max-w-4xl px-4 md:px-8" : ""}>{renderPendingAnalysisCard()}</div>
                {renderComposer(expanded)}
            </div>
        );
    };
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
                <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-900 px-6 py-8 text-white shadow-xl md:px-10">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div className="space-y-5">
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-sky-100">
                                Analysist Workspace
                            </span>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                                    Phân tích ảnh khối u và nhận tư vấn giải thích ngay trên một màn hình.
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-sky-100 md:text-base">
                                    Giao diện này hỗ trợ bác sĩ tải ảnh MRI/CT, xem kết quả phát hiện khối u dưới dạng trực quan
                                    và trao đổi nhanh với chatbot RAG để hiểu rõ hơn về ý nghĩa lâm sàng của kết quả.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-sm text-sky-100">Quy trình</p>
                                <p className="mt-2 text-xl font-semibold">Upload ảnh -&gt; Phân tích -&gt; Xem kết quả -&gt; Hỏi RAG</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <p className="text-2xl font-bold">1</p>
                                    <p className="mt-1 text-sky-100">Upload</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <p className="text-2xl font-bold">2</p>
                                    <p className="mt-1 text-sky-100">AI Detect</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="mt-1 text-sky-100">RAG Support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <section className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Upload Scan</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900">Ảnh chẩn đoán hình ảnh</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Hỗ trợ giao diện cho MRI, CT hoặc ảnh đầu vào đã chuẩn hóa từ hệ thống PACS.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Chọn ảnh phân tích
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSelectFile}
                        />

                        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
                                <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[20px] bg-white p-4 text-center">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Ảnh chẩn đoán"
                                            className="h-full max-h-[360px] w-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="max-w-sm space-y-3">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-3xl text-cyan-700">
                                                +
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800">Kéo thả hoặc chọn ảnh để tải lên</h3>
                                            <p className="text-sm leading-6 text-slate-500">
                                                Sau khi tải ảnh lên, hệ thống sẽ gọi API phân tích khối u và bạn có thể hỏi
                                                trực tiếp chatbot RAG ở cột bên phải.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-[24px] bg-slate-900 p-5 text-white">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-slate-300">Tệp đang chọn</p>
                                            <h3 className="mt-2 text-xl font-semibold">
                                                {selectedFile ? selectedFile.name : "Chưa có ảnh nào được chọn"}
                                            </h3>
                                        </div>
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                            API ready
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-sm text-slate-300">Định dạng</p>
                                            <p className="mt-2 font-semibold">{selectedFile ? selectedFile.type || "image/*" : "--"}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/5 p-4">
                                            <p className="text-sm text-slate-300">Kích thước</p>
                                            <p className="mt-2 font-semibold">
                                                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "--"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAnalyze}
                                        disabled={!selectedFile || isAnalyzing}
                                        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                                    >
                                        {isAnalyzing ? "Đang phân tích..." : "Bắt đầu phân tích"}
                                    </button>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Trạng thái</p>
                                        <p className="mt-2 font-semibold text-slate-900">
                                            {isAnalyzing ? "Processing" : hasResult ? "Completed" : "Waiting"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">Model</p>
                                        <p className="mt-2 font-semibold text-slate-900">YOLO26 + ViTRANSFORMER</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">RAG Assistant</p>
                                        <p className="mt-2 font-semibold text-slate-900">{chatStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 md:p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">Detection Result</p>
                                    <h3 className="mt-2 text-xl font-bold text-slate-900">Kết quả phát hiện khối u</h3>
                                </div>
                                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                                    {hasResult ? "Đã có kết quả" : "Chưa phân tích"}
                                </span>
                            </div>

                            {hasResult ? (
                                <div className="mt-5 space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Lưu kết quả</p>
                                            <button
                                                type="button"
                                                onClick={handleOpenSaveModal}
                                                className="rounded-xl bg-blue-600 px-6 py-2 font-medium text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Loại nghi ngờ</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">
                                                {rsFromImg?.class_and_confidence?.class || "--"}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Độ tin cậy</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">
                                                {typeof rsFromImg?.class_and_confidence?.confidence === "number"
                                                    ? `${Math.floor(rsFromImg.class_and_confidence.confidence * 100)}%`
                                                    : "--"}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Kích thước</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">
                                                {rsFromImg?.tumor_area_pixel || "--"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <h4 className="text-base font-semibold text-slate-900">Ảnh đầu vào</h4>
                                                    <p className="mt-1 text-sm text-slate-500">Ảnh gốc được dùng cho bước phân tích.</p>
                                                </div>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                    Original
                                                </span>
                                            </div>
                                            <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
                                                <div className="relative aspect-[4/3] w-full">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Ảnh đầu vào trước khi phát hiện"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <h4 className="text-base font-semibold text-slate-900">Ảnh kết quả phát hiện</h4>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Khu vực này hiển thị ảnh annotate hoặc heatmap từ backend.
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                                                    Detected
                                                </span>
                                            </div>
                                            <div className="mt-4 overflow-hidden rounded-[24px] border border-cyan-100 bg-slate-950">
                                                <div className="relative aspect-[4/3] w-full">
                                                    {rsDetect ? (
                                                        <img
                                                            src={rsDetect}
                                                            alt="Ảnh kết quả sau khi phát hiện khối u"
                                                            className="h-full w-full object-cover opacity-90"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-sm text-slate-300">
                                                            Chưa có ảnh kết quả từ backend
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <h4 className="text-base font-semibold text-slate-900">Nhận định</h4>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                                                    <p className="text-sm leading-6 text-slate-600">
                                                        {rsFromImg?.tumor_area_pixel
                                                            ? "Phát hiện vùng nghi ngờ khối u trên ảnh đầu vào."
                                                            : "Chưa phát hiện rõ vùng nghi ngờ khối u."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <div className="mt-4 space-y-4 text-sm text-slate-600">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-slate-500">Khuyến nghị</p>
                                                    <p className="mt-1 leading-6 text-red-600">***{sampleResult.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                                    <p className="text-lg font-semibold text-slate-800">Khu vực hiển thị kết quả sau khi phân tích ảnh</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Khi kết nối API thật, phần này có thể hiển thị xác suất, vị trí tổn thương, heatmap,
                                        loại khối u và các khuyến nghị liên quan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside>
                        {renderChatPanel({ expanded: false, viewportRef: chatViewportRef, heightClass: "h-[460px]" })}
                    </aside>
                </div>
            </div>
            {isChatExpanded ? (
                <div className="fixed inset-0 z-[80] h-screen w-screen overflow-hidden bg-[#f8f8f6]">
                    {renderChatPanel({ expanded: true, viewportRef: expandedChatViewportRef, heightClass: "flex-1 min-h-0" })}
                </div>
            ) : null}
            <SaveInfor
                isOpen={isSaveModalOpen}
                onClose={handleCloseSaveModal}
                onSubmit={handleSavePatientInfo}
                initialData={buildInitialSaveData()}
            />
        </div>
    );
}
