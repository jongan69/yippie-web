"use client"
import Link from "next/link";
// import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
// import { ImageEditor } from "../components/stickerApp/sticker-adder";
import dynamic from 'next/dynamic'
const ImageEditor = dynamic(() => import('../components/stickerApp/sticker-adder').then((mod: any) => mod.ImageEditor), {
  ssr: false,
})
export default function IndexPage() {
  // const canvasRef = useRef<any>(null);

  // const saveCanvas = () => {
  //   if (canvasRef.current) {
  //     const link = document.createElement('a');
  //     link.download = 'canvas_image.png';
  //     link.href = canvasRef.current.toDataURL("image/png");
  //     link.click();
  //   }
  // };

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
        <ImageEditor />
        {/* <button onClick={saveCanvas} style={{ margin: 10 }}>Save Image</button> */}
        {/* <button onClick={() => canvasRef.current && canvasRef.current.saveCanvas()} style={{ margin: 10 }}>Save Image</button> */}
      </div>
    </section>
  )
}
