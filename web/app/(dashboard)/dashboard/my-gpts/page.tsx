"use client";

import { useEffect, useState } from "react";

import Cards from "../_components/Cards";
import { Gpts } from "@/app/types/gpts";
import GptsTab from "../_components/GptsTab";
import { usePathname } from "next/navigation";

export default () => {
  const [gptsList, setGptsList] = useState<Gpts[] | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const fetchUserGpts = async () => {
    setLoading(true);
    const uri = "/api/dashboard/user-gpts";
    const data = {
      is_promoted: false,
    };
    const resp = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (resp.ok) {
      const res = await resp.json();
      if (res.data) {
        setGptsList(res.data);
        return;
      }
    }
  };

  useEffect(() => {
    fetchUserGpts();
  }, [pathname]);

  return (
    <div>
      <h2 className="text-3xl font-medium mb-8">My GPTs</h2>
      <GptsTab />
      <Cards gptsList={gptsList} loading={loading} />
    </div>
  );
};
