import FloatedButton from '@/components/floated-button';
import Layout from '@/components/layouts';
import { Stream } from '@prisma/client';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  const { data } = useSWR<StreamsResponse>(`/api/streams`);
  return (
    <Layout title="라이브" hasTabBar>
      <div className="py-10 divide-y-2 space-y-4">
        {data?.streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <div className="pt-4 px-4 block">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-gray-900 font-bold text-2xl mt-2">
                {stream.name}
              </h1>
            </div>
          </Link>
        ))}
        <FloatedButton href="streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatedButton>
      </div>
    </Layout>
  );
};

export default Streams;
