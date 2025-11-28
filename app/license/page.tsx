"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Support() {
    const router = useRouter();

    useEffect(() => {
        router.push("https://github.com/bubblymaps/maps/blob/master/LICENSE");
    }, [router]);

    return null;
}
