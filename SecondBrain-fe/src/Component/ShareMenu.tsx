import toast from "react-hot-toast";
import WhatsappIcon from '../Icons/WhatsappIcon';
import ClipBoardIcon from "../Icons/ClipBoardIcon";
import TeleGramIcon from "../Icons/TeleGramIcon";
import OutLook from "../Icons/OutLook";

export function ShareMenu({ link, title,onClose }: { link: string; title: string,onClose: ()=>void }) {
  const encodedLink = encodeURIComponent(link);
  const encodedTitle = encodeURIComponent(title);

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <WhatsappIcon/>,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedLink}`,
    },
    {
      label: "Telegram",
      icon: <TeleGramIcon/>,
      url: `https://t.me/share/url?url=${encodedLink}&text=${encodedTitle}`,
    },
    {
      label: "Outlook",
      icon: <OutLook/>,
      url: `mailto:?subject=${encodedTitle}&body=${encodedLink}`, // No direct share API; open app
      
    },
    {
      label: "Copy Link",
      icon: <ClipBoardIcon/>,
      onClick: () => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
      },
    },
  ];

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      
      <div
        className="bg-gray-900 p-6 rounded-xl shadow-lg w-80 grid grid-cols-2 gap-4 relative"
        onClick={(e) => e.stopPropagation()} // prevents click bubbling
      >
        <div className="flex bg-red-200 w-full">
          <button className="absolute top-2 right-2  text-white hover:text-red-500 " onClick={onClose}>✕</button>
        </div>

        <h2 className="col-span-2 text-lg text-white font-semibold mb-2 text-center">Send Via...</h2>

        {shareOptions.map((opt, i) => (
          <div key={i} className="flex flex-col items-center text-center cursor-pointer">
            {opt.onClick ? (
              <div onClick={opt.onClick} className="hover:scale-105 transition-transform text-white  flex flex-col items-center justify-center ">
                {opt.icon}
                <p className="text-sm mt-1">{opt.label}</p>
              </div>
            ) : (
              <a
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:scale-105 transition-transform`}
              >
                {opt.icon}
                <p className="text-sm mt-1 text-white">{opt.label}</p>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

