"use client"
import Link from "next/link";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { ImageEditor } from "../components/stickerApp/sticker-adderv1";
import useCanvas from "@/lib/hooks/useCanvas";

export default function IndexPage() {
  const [canvasRef, saveAsImage] = useCanvas(([canvas, ctx]) => {
    // Your canvas initialization code here
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });


    // Function to handle saving the canvas as an image
    const handleSaveImage = () => {
      saveAsImage('yippieeeee.png');
    };
  
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          TRILLIONS WILL <br className="hidden sm:inline" />
          TIPPIE!!
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
        <ImageEditor canvasRef={canvasRef}/>
        <button onClick={handleSaveImage} style={{ margin: 10 }}>Save Image</button>
      </div>
    </section>
  )
}
