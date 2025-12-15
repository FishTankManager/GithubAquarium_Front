import { GithubLogo, MailIcon } from "@/assets/svg";

export default function Footer() {
  return (
    <footer className="bg-[#c7af7c]">
      <div className="flex w-full flex-col items-start justify-center px-2 py-4 text-[9.5px] text-white md:px-10 md:text-[17px] lg:text-[22px]">
        <div className="mb-1 flex items-center">
          <GithubLogo className="mr-1.5 inline-block h-4 w-4" />
          <span className="mr-2">DEVELOPERS: </span>
          <span
            className="flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("https://github.com/eileen914")}
          >
            eileen914
          </span>
          <span className="mr-2">,</span>
          <span
            className="flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("https://github.com/Imggaggu")}
          >
            Imggaggu
          </span>
          <span className="mr-2">,</span>
          <span
            className="flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("https://github.com/SuhyunBan")}
          >
            SuhyunBan
          </span>
          <span className="mr-2">,</span>
          <span
            className="flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("https://github.com/Jongpippan")}
          >
            Jongpippan
          </span>
          <span className="mr-2">,</span>
          <span
            className="flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("https://github.com/jay20012024")}
          >
            jay20012024
          </span>
        </div>
        <div className="flex items-center">
          <MailIcon className="mr-1.5 inline-block h-4 w-4" />
          <span className="mr-2">CONTACT:</span>
          <span
            className="mr-2 flex cursor-pointer items-center hover:text-gray-800 hover:underline"
            onClick={() => window.open("mailto:likelion@snu.ac.kr")}
          >
            likelion@snu.ac.kr
          </span>
        </div>
      </div>
    </footer>
  );
}
