import Link from "next/link";

type PageProps = {};

function Page({}: PageProps) {
  return (
    <div>
      <ul>
        <li>
          <Link href="/infinite">useSWRInfiniteを利用したサンプル</Link>
        </li>
      </ul>
    </div>
  );
}

export default Page;
