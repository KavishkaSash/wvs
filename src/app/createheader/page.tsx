"use client";

import { Suspense } from "react";
import HeaderDetailsTable from "../components/HeaderDetailsTable";

interface Props {}

const Page: React.FC<Props> = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderDetailsTable />
      </Suspense>
    </div>
  );
};

export default Page;
