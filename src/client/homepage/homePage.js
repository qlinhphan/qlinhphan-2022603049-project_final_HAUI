import React, { useEffect, useState } from "react";
import FeatureClient from "./featureClient";
import IntroClient from "./introClient";
import { useSelector } from "react-redux";

// import { img } from '../../public/image.png'

export default function HomePage() {

    const accessToken = useSelector((state) => state.user.user.accessToken)

    // useEffect(() => {
    //     console.log('cecs: ', accessToken)
    // }, [])


    const [page, setPage] = useState("home");
    const [tab, setTab] = useState("upload");
    const [preview, setPreview] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };



    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {/* Navbar */}
            {/* <HeaderClient setPage={setPage}></HeaderClient> */}

            <div className="max-w-7xl mx-auto p-6">

                {/* HOME */}
                {page === "home" && (
                    <div className="space-y-12">

                        <IntroClient></IntroClient>

                        {/* FEATURES SECTION */}
                        <FeatureClient setPage={setPage}></FeatureClient>
                    </div>
                )}

                {/* DASHBOARD */}
                {page === "dashboard" && (
                    <div>
                        {/* Tabs + Upload/History/Profile/Auth (giữ nguyên code cũ) */}
                        {/* ... toàn bộ code dashboard hiện tại của bạn ... */}
                    </div>
                )}
            </div>

            {/* <FooterClient setPage={setPage}></FooterClient> */}
        </div>
    );
}
