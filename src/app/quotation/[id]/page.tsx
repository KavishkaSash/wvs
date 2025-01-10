// app/quotation/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuotationById } from "@/app/api/quotation";
import { Quotation } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const QuotationDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuotation = async () => {
      try {
        const data = await fetchQuotationById(params.id as string);
        setQuotation(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch quotation");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadQuotation();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Quotation not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{quotation.title}</h1>
            <div className="text-sm text-gray-500">
              By {quotation.author} •{" "}
              {new Date(quotation.date).toLocaleDateString()}
            </div>
          </div>

          <div
            className="inline-block px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: quotation.categoryColor || "#e5e7eb" }}
          >
            {quotation.category}
          </div>

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{quotation.body}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuotationDetail;
