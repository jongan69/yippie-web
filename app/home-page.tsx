"use client"
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from "react";
import { useDetectDevice } from "@/lib/useDevice";
const ParentComponent = dynamic(() => import('../components/stickerApp/CanvasContainer'), {
  ssr: false,
})

export default function IndexPage() {
  // Using useState hook to manage the mobile state
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const deviceData = useDetectDevice()
  const getData = useCallback(async () => {
    return setIsMobile(deviceData.isMobileRes);
  }, [deviceData.isMobileRes]);
  
  useEffect(() => {
    getData()
  }, [deviceData, getData])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          TRILLIONS WILL <br className="hidden sm:inline" />
          YIPPIE
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to the Yippie Generator
        </p>
        <Link
          href={siteConfig.links.link}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          YIPPIE
        </Link>
      </div>
      <div className="flex justify-center gap-4">

        {/* <button onClick={saveCanvas} style={{ margin: 10 }}>Save Image</button> */}
        {/* <button onClick={() => canvasRef.current && canvasRef.current.saveCanvas()} style={{ margin: 10 }}>Save Image</button> */}
      </div>
      <ParentComponent isMobile={isMobile} />
    </section>
  )
}
