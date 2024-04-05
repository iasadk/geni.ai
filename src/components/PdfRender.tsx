"use client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import { cn } from "@/lib/utils";
import PdfFullscreen from "./PdfFullScreen";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PageProps {
  fileUrl: string;
}
export const PdfRender = ({ fileUrl }: PageProps) => {
  // TODO: FIX ON-LOAD PDF RENDER ISSUE.
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;
  return (
    <>
      <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
        <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant={"ghost"}
              aria-label="previous page"
              onClick={() => currPage !== 1 && setCurrPage(currPage - 1)}
              disabled={currPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              <Input
                className="w-12 h-8"
                value={currPage}
                type="number"
                onChange={(e) =>
                  Number(e.target.value) <= numPages! &&
                  setCurrPage(
                    Number(e.target.value) === 0 ? 1 : Number(e.target.value)
                  )
                }
                disabled={currPage === numPages}
              />
              <p className="text-zinc-700 text-sm space-x-1">
                <span>/</span>
                <span>{numPages ?? "x"}</span>
              </p>
            </div>

            <Button
              variant={"ghost"}
              aria-label="next page"
              onClick={() => currPage !== numPages && setCurrPage(currPage + 1)}
              disabled={numPages === undefined || currPage === numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                  <Search className="h-4 w-4" />
                  {scale * 100}%
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setRotation((prev) => prev + 90)}
              variant="ghost"
              aria-label="rotate 90 degrees"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <PdfFullscreen fileUrl={fileUrl} />
          </div>
        </div>

        {/* PDF VIEWER */}
        <div className="flex-1 w-full max-h-screen">
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
            <div ref={ref}>
              <Document
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onLoadError={() => {
                  toast({
                    title: "Error Loading PDF",
                    description: "Please Try Again later.",
                    variant: "destructive",
                  });
                }}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                }}
                className={"max-h-full"}
                file={fileUrl}
              >
                {isLoading && renderedScale ? (
                  <Page
                    width={width ? width : 1}
                    pageNumber={currPage}
                    scale={scale}
                    rotate={rotation}
                    key={"@" + renderedScale}
                  />
                ) : null}

                <Page
                  className={cn(isLoading ? "hidden" : "")}
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + scale}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              </Document>
            </div>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};
