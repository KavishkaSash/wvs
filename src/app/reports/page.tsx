import { NextPage } from "next";
import Reports from "../components/Reports";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <Reports />
    </div>
  );
};

export default Page;
