"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import user1 from "@/assets/images/daos/profile.png";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import { Button, Pagination, Tooltip } from "@nextui-org/react";
import { Oval } from "react-loader-spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function DelegatesList({ props }: { props: string }) {
  const [delegateData, setDelegateData] = useState<any>();
  const [tempData, setTempData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/delegates?name=${props}&offset=${currentPage}&order=desc&field=delegatedVotes&period=lifetime&pageSize=20&statuses=active,inactive,withdrawn,recognized`
        );
        const daoInfo = await res.json().then((delegates) => delegates.data);
        setDelegateData(daoInfo);
        setTempData(daoInfo.delegates);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
    router.push(`${path}?active=delegatesList&page=${currentPage}`);
  }, [currentPage]);

  useEffect(() => {
    if (Number(searchParams.get("page")) >= 0) {
      setCurrentPage(Number(searchParams.get("page")));
    }
  }, []);

  // console.log("dao-info: ", delegateData.delegates);

  const handleSearchChange = (query: string) => {
    console.log("query: ", query);

    setSearchQuery(query);

    if (query.length > 0) {
      console.log("Delegate data: ", query, delegateData);
      console.log(delegateData);
      const filtered = tempData.filter(
        (item: any) =>
          (item.ensName !== null &&
            item.ensName.startsWith(query.toLowerCase())) ||
          item.publicAddress.startsWith(query)
      );
      console.log("Filtered Data: ", filtered);
      const newData = { ...delegateData, delegates: filtered };
      setDelegateData(newData);
    } else {
      setDelegateData({ ...delegateData, delegates: tempData });
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return 0;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-fit rounded-full my-3 font-poppins"
        >
          <input
            type="text"
            placeholder="Search"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div>
      </div>

      <div className="py-8 pe-10 font-poppins">
        {isPageLoading ? (
          <div className="flex items-center justify-center">
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#0500FF"
              secondaryColor="#cdccff"
              ariaLabel="oval-loading"
            />
          </div>
        ) : delegateData.delegates.length > 0 ? (
          <div>
            <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 ">
              {delegateData.delegates.map((daos: any, index: number) => (
                <div
                  key={index}
                  style={{
                    boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                  }}
                  className="px-5 py-7 rounded-2xl"
                >
                  <div className="flex justify-center">
                    <Image
                      src={
                        daos.profilePicture == null
                          ? user1
                          : daos.profilePicture
                      }
                      alt="Image not found"
                      width={80}
                      height={80}
                      className="rounded-full"
                    ></Image>
                  </div>

                  <div className="text-center">
                    <div className="py-3">
                      <div className="font-semibold">
                        {daos.ensName == null ? (
                          <span>
                            {daos.publicAddress.substring(0, 5)}...
                            {daos.publicAddress.substring(
                              daos.publicAddress.length - 4
                            )}
                          </span>
                        ) : (
                          daos.ensName
                        )}
                      </div>
                      <div className="flex justify-center items-center gap-2 pb-2 pt-1">
                        {daos.publicAddress.substring(0, 5)}...
                        {daos.publicAddress.substring(
                          daos.publicAddress.length - 4
                        )}
                        <Tooltip
                          content="Copy"
                          placement="right"
                          closeDelay={1}
                          showArrow
                        >
                          <span className="cursor-pointer text-sm">
                            <IoCopy
                              onClick={() => handleCopy(daos.publicAddress)}
                            />
                          </span>
                        </Tooltip>
                      </div>
                      <div className="text-sm border border-[#D9D9D9] py-2 px-1 rounded-lg w-full">
                        <span className="text-blue-shade-200 font-semibold">
                          {formatNumber(daos.delegatedVotes)}&nbsp;
                        </span>
                        delegated tokens
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-blue-shade-100 text-white font-poppins w-full rounded-[4px] text-sm py-1 font-medium"
                      onClick={() =>
                        router.push(
                          `/${props}/${daos.publicAddress}?active=info  `
                        )
                      }
                    >
                      View Profile
                    </button>
                  </div>
                  <Toaster
                    toastOptions={{
                      style: {
                        fontSize: "14px",
                        backgroundColor: "#3E3D3D",
                        color: "#fff",
                        boxShadow: "none",
                        borderRadius: "50px",
                        padding: "3px 5px",
                      },
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              className={`pe-4 pt-12 flex items-center justify-center gap-10 ${
                isPageLoading ? "hidden" : ""
              } `}
            >
              <button
                disabled={currentPage == 0}
                className={`text-white px-4 py-1 rounded-md font-semibold ${
                  currentPage == 0 ? "bg-[#6B98FF]" : "bg-blue-shade-100"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
                }
              >
                Previous
              </button>
              <button
                className="bg-blue-shade-100 text-white px-6 py-1 rounded-md font-semibold"
                onClick={() =>
                  setCurrentPage((prev) => (prev < 1000 ? prev + 1 : prev))
                }
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DelegatesList;
