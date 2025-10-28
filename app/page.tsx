import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[url('/images/bg.png')] bg-cover bg-center h-[100vh] w-full">
      <div className="w-full h-[90%] absolute bottom-0 flex flex-row">
        <div className="flex-2 flex justify-center items-center ">
          <div className="p-10 md:pl-8 md:pr-48 py-6 ">
            <h1 className="text-4xl lgtext-6xl font-bold">
              EMPOWER , EDUCATE , CONNECT
            </h1>
            <p className="text-xl lg:text-2xl mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-1 relative">
          <Image
            src="/images/boy.png" // replace with your image path
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-full h-12 lg:h-18 bottom-0 absolute flex flex-row">
        <div className="flex-3 flex">
          {/* tap */}
          <Link
            href="/s?t=school"
            className="relative flex-1 bg-[url('/images/tap1.png')] bg-cover bg-center flex justify-center items-center md:rounded-tr-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-50 z-0 md:rounded-tr-2xl"></div>
            <div className="text-white text-xl z-10">
              <h1 className="font-bold text-sm lg:text-2xl">Schools</h1>
            </div>
          </Link>
          <Link
            href="s?t=academy"
            className="relative flex-1 bg-[url('/images/tap2.png')] bg-cover bg-center flex justify-center items-center md:rounded-t-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-50 z-0 md:rounded-t-2xl"></div>
            <div className="text-white text-xl z-10">
              <h1 className="font-bold text-sm lg:text-2xl">Academies</h1>
            </div>
          </Link>
          <Link
            href="/s?t=center"
            className="relative flex-1 bg-[url('/images/tap1.png')] bg-cover bg-center flex justify-center items-center md:rounded-t-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-50 z-0 md:rounded-t-2xl"></div>
            <div className="text-white text-xl z-10">
              <h1 className="font-bold text-sm lg:text-2xl">Center</h1>
            </div>
          </Link>
          <Link
            href="/s?t=instructor"
            className="relative flex-1 bg-[url('/images/tap2.png')] bg-cover bg-center flex justify-center items-center md:rounded-t-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-50 z-0 md:rounded-t-2xl"></div>
            <div className="text-white text-xl z-10">
              <h1 className="font-bold text-sm lg:text-2xl">Instructors</h1>
            </div>
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-2 relative"></div>
      </div>
    </div>
  );
}
