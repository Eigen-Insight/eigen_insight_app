import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect, useState } from "react";
import { Oval, ThreeCircles } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import connectImg from "@/assets/images/instant-meet/connect.png";
import connectImghover from "@/assets/images/instant-meet/connectHover.svg";
import accessImg from "@/assets/images/instant-meet/quick-access.png";
import accessImghover from "@/assets/images/instant-meet/accessImghover.svg";
import videoImg from "@/assets/images/instant-meet/video-call.png";
import videoImghover from "@/assets/images/instant-meet/videoImghover.svg";
import audioImg from "@/assets/images/instant-meet/audio-call.png";
import audioImghover from "@/assets/images/instant-meet/audioImghover.svg";
import screenImg from "@/assets/images/instant-meet/screen-share.png";
import screenImghover from "@/assets/images/instant-meet/screenImghover.svg";
import chatImg from "@/assets/images/instant-meet/chat.png";
import chatImghover from "@/assets/images/instant-meet/chatImghover.svg";
import heroImg from "@/assets/images/instant-meet/instant-meet-hero.svg";
import "../../css/InstantMeet.css";

interface instantMeetProps {
  isDelegate: boolean;
  selfDelegate: boolean;
  daoName: string;
}

function InstantMeet({ isDelegate, selfDelegate, daoName }: instantMeetProps) {
  const [modalData, setModalData] = useState({
    title: "",
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmSave, setConfirmSave] = useState(false);
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [isScheduling, setIsScheduling] = useState(false);
  // const [daoName, setDaoName] = useState<string>();
  const router = useRouter();

  const handleModalInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log("Value in modal: ", value);
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const startInstantMeet = async () => {
    setConfirmSave(true);
    const createRoomUrl = process.env.NEXT_PUBLIC_CREATE_ROOM;

    if (!createRoomUrl) {
      console.error(" environment variable is not set.");
      return null;
    }
    const res = await fetch(createRoomUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    const roomId = await result.data;
    console.log("Instant meet: ", roomId);

    let localDateTime = new Date();

    // Convert the local date and time to the specified format (YYYY-MM-DDTHH:mm:ss.sssZ)
    let dateInfo = localDateTime.toISOString();

    console.log("Modal details: ", modalData);

    const requestData = {
      operator_or_avs: daoName,
      slot_time: dateInfo,
      title: modalData.title,
      description: modalData.description,
      host_address: address,
      session_type: "instant-meet",
      meetingId: roomId,
      meeting_status: "Ongoing",
      attendees: [],
    };

    console.log("requestData", requestData);

    const requestOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    try {
      // console.log("calling.......");
      const response = await fetch("/api/book-slot", requestOptions);
      const result = await response.json();
      console.log("result of book-slots", result);
      if (result.success) {
        // setIsScheduled(true);
        setConfirmSave(false);
        router.push(`/meeting/session/${roomId}/lobby`);
      }
    } catch (error) {
      setConfirmSave(false);
      // setIsScheduled(false);
      console.error("Error:", error);
    }
    setModalData({
      title: "",
      description: "",
    });
  };

  const block = [
    {
      image: connectImg,
      hoverImage: connectImghover,
      title: "Connect with Others Instantly",
      description:
        "Engage with yourself in an instant meeting and share the link with the people you want to connect with. Experience the following features for a comprehensive virtual meeting experience.",
    },
    {
      image: accessImg,
      hoverImage: accessImghover,
      title: "Quick Access to Links",
      description:
        "Access the quick links directly within the meeting itself,making it easier to reference and share relevant information during your session.",
    },
    {
      image: videoImg,
      hoverImage: videoImghover,
      title: "Video Call",
      description:
        " Connect seamlessly and engage face-to-face with crisp and clear video quality, bringing your virtual meetings to life.",
    },
    {
      image: audioImg,
      hoverImage: audioImghover,
      title: "Audio Call",
      description:
        "Experience crystal-clear audio that ensures smooth and effective communication with all participants, enhancing the meeting experience.",
    },
    {
      image: screenImg,
      hoverImage: screenImghover,
      title: "Screen Sharing",
      description:
        "Effortlessly share your screen to showcase documents, presentations,or any other content, making collaboration more interactive and dynamic.",
    },
    {
      image: chatImg,
      hoverImage: chatImghover,
      title: "Chat",
      description:
        "Foster real-time communication by sending text messages to participants within the meeting, allowing for quick exchanges and enhanced collaboration.",
    },
  ];

  return (
    <div>
      <div className="pb-28 pr-12">
        <div className="">
          <div className="grid grid-cols-7 rounded-3xl border-solid border-2 border-[#F9F9F9]-900">
            <div className="col-span-4 border-solid border-r-2 border-[#F9F9F9]-900">
              <div className="p-14">
                <div className="text-[#A7DBF2] text-3xl font-semibold font-poppins text-center">
                  Start an Instant Meeting
                </div>

                <div className="grid grid-cols-3 grid-rows-2 text-sm gap-11 font-semibold pt-8 text-white text-center">
                  {block.map((data, index) => (
                    <Tooltip
                      key={index}
                      content={
                        <div className="px-1 py-3 w-80 ">
                          <div className="font-poppins text-black text-center">
                            {data.description}
                          </div>
                        </div>
                      }
                      placement="top"
                      className="group w-fit"
                      motionProps={{
                        variants: {
                          exit: {
                            opacity: 0,
                            transition: {
                              duration: 0.5,
                              ease: "easeIn",
                            },
                          },
                          enter: {
                            opacity: 1,
                            transition: {
                              duration: 0.25,
                              ease: "easeOut",
                            },
                          },
                        },
                      }}
                    >
                      <div>
                        <div className="relative group border rounded-3xl bg-[#E5E5EA] flex items-center justify-center p-8 hover:bg-light-blue ">
                          <Image
                            alt="{image}"
                            height={60}
                            width={60}
                            src={data.image}
                            className="transition duration-300 ease-in-out transform group-hover:hidden"
                            quality={100}
                            priority
                          />
                          <Image
                            alt="{hoverImage}"
                            height={60}
                            width={60}
                            src={data.hoverImage}
                            className="hidden transition duration-300 ease-in-out transform group-hover:block group-hover:scale-105"
                            quality={100}
                            priority
                          />
                        </div>
                        <div className="p-2">
                          <span className="">{data.title}</span>
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-3 flex flex-col p-3 items-center justify-center -mt-[25%]">
              <div className="h-auto w-auto bg-cover mb-[-20%]">
                <Image alt="img7" src={heroImg} quality={100} priority />
              </div>
              <div className="text-center transition-transform transform hover:scale-105 duration-300">
                <button
                  className="bg-[#214965] mt-3 w-fit flex justify-center items-center text-white rounded-full cursor-pointer font-semibold overflow-hidden relative z-100 border-2 border-light-cyan group text-base py-3 px-8"
                  onClick={onOpen}
                >
                  <span className="relative z-10 text-white group-hover:text-white text-xl duration-500">
                    Start an instant meet
                  </span>
                  <span className="absolute w-full h-full bg-navy-blue -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-1500"></span>
                  <span className="absolute w-full h-full bg-navy-blue -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-1500"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          // setIsScheduling(false);
        }}
        className="font-poppins modalIm-bg"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Provide details for instant meet
            </ModalHeader>
            <ModalBody>
              <div className="px-1 font-medium">Title:</div>
              <input
                type="text"
                name="title"
                value={modalData.title}
                onChange={handleModalInputChange}
                placeholder="Explain Governance"
                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                required
              />

              <div className="px-1 font-medium">Description:</div>
              <textarea
                name="description"
                value={modalData.description}
                onChange={handleModalInputChange}
                placeholder="Please share anything that will help prepare for our meeting."
                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                required
              />

              <div className="px-1 font-medium">
                Select Operators/AVSs :
                <select
                  id="dropdown"
                  name="options"
                  className="border bg-[#D9D9D945] rounded-md px-2 py-1 mt-3 text-sm w-full capitalize text-white"
                >
                  <option value="eigenlayer" selected>
                    EigenLayer
                  </option>
                  <option value="operators" className="cursor-not-allowed" disabled>
                    Operators - Coming soon 🚀
                  </option>
                  <option value="avss" className="cursor-not-allowed" disabled>
                    AVSs - Coming soon 🚀
                  </option>
                </select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                onClick={() => {
                  onClose();
                  // setIsScheduling(false);
                }}
              >
                Close
              </Button>
              <Button
                className="btnSave text-white"
                onClick={startInstantMeet}
                isDisabled={confirmSave}
              >
                {confirmSave ? (
                  <div className="flex items-center justify-center">
                    <ThreeCircles
                      visible={true}
                      height="50"
                      width="50"
                      color="#FFFFFF"
                      ariaLabel="three-circles-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  <>Save</>
                )}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default InstantMeet;
