import React, { useEffect, useMemo, useRef, useState } from "react";

const sampleResult = {
    status: "Nguy cơ cao",
    tumorType: "Glioma",
    confidence: 96,
    size: "24 x 18 mm",
    location: "Thùy trán trái",
    recommendation: "Ưu tiên hội chẩn chuyên khoa và đối chiếu thêm với MRI có tiêm thuốc cản quang.",
    findings: [
        "Phát hiện vùng bất thường có biên không đều.",
        "Mật độ tín hiệu tăng nhẹ quanh khối nghi ngờ.",
        "Khả năng xâm lấn mô lân cận cần được đánh giá thêm.",
    ],
};

const starterQuestions = [
    "Giải thích ý nghĩa chỉ số confidence",
    "Những bước cận lâm sàng nên thực hiện tiếp theo?",
    "Tóm tắt kết quả cho bệnh án",
];

const initialMessages = [
    {
        id: 1,
        role: "assistant",
        content:
            "Tôi là trợ lý RAG dành cho bác sĩ. Sau khi có kết quả phân tích ảnh, tôi có thể giải thích chỉ số, tóm tắt nhận định và gợi ý hướng tư vấn tiếp theo.",
    },
];

export default function Analysist() {
    const fileInputRef = useRef(null);
    const chatViewportRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState(initialMessages);

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
    }, [messages]);

    const result = useMemo(() => {
        if (!hasResult) return null;
        return sampleResult;
    }, [hasResult]);

    const handleSelectFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setHasResult(false);
    };

    const handleAnalyze = () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setHasResult(false);

        window.setTimeout(() => {
            setIsAnalyzing(false);
            setHasResult(true);
        }, 1400);
    };

    const handleSendMessage = (question) => {
        const content = question || chatInput.trim();
        if (!content) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            content,
        };

        const assistantMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: hasResult
                ? "Dựa trên kết quả hiện tại, đây là phần giải thích giao diện mẫu cho chatbot RAG. Khi nối backend, nội dung này có thể lấy từ tri thức y khoa và dữ liệu ca bệnh để hỗ trợ bác sĩ chính xác hơn."
                : "Giao diện chat đã sẵn sàng. Sau khi hệ thống phân tích ảnh và trả kết quả, chatbot RAG có thể dùng kết quả đó để giải thích chi tiết cho bác sĩ.",
        };

        setMessages((current) => [...current, userMessage, assistantMessage]);
        setChatInput("");
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
                                <p className="mt-2 text-xl font-semibold">Upload ảnh → Phân tích → Xem kết quả → Hỏi RAG</p>
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
                                                Chưa có logic backend. Phần này hiện là giao diện mẫu để hiển thị preview ảnh và
                                                chuẩn bị cho bước phân tích AI.
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
                                            UI only
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
                                        {isAnalyzing ? "Đang mô phỏng phân tích..." : "Bắt đầu phân tích"}
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
                                        <p className="mt-2 font-semibold text-slate-900">Tumor Detector v1</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">RAG Assistant</p>
                                        <p className="mt-2 font-semibold text-slate-900">Ready</p>
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

                            {result ? (
                                <div className="mt-5 space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Mức cảnh báo</p>
                                            <p className="mt-2 text-lg font-bold text-rose-600">{result.status}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Loại nghi ngờ</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{result.tumorType}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Độ tin cậy</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{result.confidence}%</p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-sm text-slate-500">Kích thước</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{result.size}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <h4 className="text-base font-semibold text-slate-900">Nhận định chính</h4>
                                            <div className="mt-4 space-y-3">
                                                {result.findings.map((item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-start gap-3 rounded-2xl border border-slate-100 px-4 py-3"
                                                    >
                                                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                                                        <p className="text-sm leading-6 text-slate-600">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                                            <h4 className="text-base font-semibold text-slate-900">Tóm tắt nhanh</h4>
                                            <div className="mt-4 space-y-4 text-sm text-slate-600">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-slate-500">Vị trí nghi ngờ</p>
                                                    <p className="mt-1 font-semibold text-slate-900">{result.location}</p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-slate-500">Khuyến nghị</p>
                                                    <p className="mt-1 leading-6 text-slate-700">{result.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                                    <p className="text-lg font-semibold text-slate-800">Khu vực hiển thị kết quả sau khi phân tích ảnh</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Khi bạn nối API thật, phần này có thể hiển thị xác suất, vị trí tổn thương, heatmap, loại khối u
                                        và các khuyến nghị liên quan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">RAG Chatbot</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900">Trợ lý giải thích kết quả</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Giao diện chat dành cho bác sĩ cần hỏi thêm về ý nghĩa của kết quả phân tích.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                Online
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <p className="text-sm font-medium text-slate-500">Gợi ý câu hỏi nhanh</p>
                            <div className="flex flex-wrap gap-2">
                                {starterQuestions.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onClick={() => handleSendMessage(question)}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            ref={chatViewportRef}
                            className="mt-5 flex h-[460px] flex-col gap-4 overflow-y-auto rounded-[24px] bg-slate-50 p-4"
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === "assistant"
                                            ? "self-start bg-white text-slate-700"
                                            : "self-end bg-slate-900 text-white"
                                        }`}
                                >
                                    {message.content}
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                            <textarea
                                rows={4}
                                value={chatInput}
                                onChange={(event) => setChatInput(event.target.value)}
                                placeholder="Nhập câu hỏi cho chatbot RAG, ví dụ: kết quả này có ý nghĩa gì trong lâm sàng?"
                                className="w-full resize-none border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                <p className="text-xs text-slate-400">
                                    Đây là giao diện mẫu. Nội dung chat hiện đang dùng dữ liệu minh họa.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage()}
                                    className="rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                                >
                                    Gửi câu hỏi
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
