"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import search from "@/assets/images/daos/search.png";
import WatchSession from "./WatchSession";
import WatchSessionList from "./WatchSessionList";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface AttestationObject {
  attendee_address: string;
  attendee_uid: string;
}

function WatchComponentMain({ props }: { props: { id: string } }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>();
  const [collection, setCollection] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const requestOptions: any = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `/api/get-watch-data/${props.id}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data[0]);
        setCollection(result.collection);
        console.log(result.data[0].video_uri.video_uri);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [props.id]);

  function utcToLocal(utcDateString: any) {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcDateString);

    // Get the local date and time components
    const localDate = utcDate.toLocaleDateString();
    const localTime = utcDate.toLocaleTimeString();

    // Combine and return the formatted local date and time
    return `${localDate} ${localTime}`;
  }

  return (
    <>
      {data ? (
        <div className="ps-14">
          <div className="flex justify-between items-center pt-6 pb-3 pe-10">
            <div className="font-poppins font-medium text-5xl">
              <span className="text-black">Chora</span>{" "}
              <span className="text-blue-shade-200">Club</span>
            </div>
            <ConnectButton />
          </div>
          <div className="flex my-4 items-center gap-4 font-poppins">
            <div
              style={{ background: "rgba(238, 237, 237, 0.36)" }}
              className="flex border-[0.5px] border-black w-fit rounded-full"
            >
              <input
                type="text"
                placeholder="Search"
                style={{ background: "rgba(238, 237, 237, 0.36)" }}
                className="pl-5 rounded-full outline-none"
                value={searchQuery}
                // onChange={(e) => handleSearchChange(e.target.value)}
              ></input>
              <span className="flex items-center bg-black rounded-full px-5 py-2">
                <Image src={search} alt="search" width={20} />
              </span>
            </div>
            <div className="space-x-4">
              <button className="border border-[#CCCCCC] px-6 py-1 bg-[#8E8E8E] rounded-lg text-lg text-white">
                All
              </button>
              <button className="border border-[#CCCCCC] px-6 py-1 bg-[#F5F5F5] rounded-lg text-lg text-[#3E3D3D]">
                Optimism
              </button>
              <button className="border border-[#CCCCCC] px-6 py-1 bg-[#F5F5F5] rounded-lg text-lg text-[#3E3D3D]">
                Arbitrum
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <WatchSession data={data} collection={collection} />
            </div>
            <div className="col-span-1">
              <WatchSessionList />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-5">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      )}
    </>
  );
}

export default WatchComponentMain;
