import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import text1 from "@/assets/images/daos/texture1.png";
import Tile from "../utils/Tile";
import { Oval, ThreeCircles } from "react-loader-spinner";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}
interface Session {
  _id: string;
  host_address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  meeting_status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  operator_or_avs: string;
  attendees: any[];
}

function DelegateOfficeHrs({ props }: { props: Type }) {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const operator_or_avs = props.daoDelegates;
  // props.daoDelegates.charAt(0).toUpperCase() + props.daoDelegates.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          address: props.individualDelegate,
        });

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        const response = await fetch(
          "/api/get-officehours-address",
          requestOptions
        );
        const result = await response.json();
        console.log(result);

        //api for individual attendees
        const rawData = JSON.stringify({
          attendee_address: props.individualDelegate,
        });

        const requestOption: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: rawData,
        };

        const responseData = await fetch(
          "/api/get-attendee-individual",
          requestOption
        );
        const resultData = await responseData.json();
        console.log(resultData);

        if (
          searchParams.get("hours") === "ongoing" ||
          searchParams.get("hours") === "upcoming" ||
          searchParams.get("hours") === "hosted"
        ) {
          const filteredSessions = result.filter((session: Session) => {
            if (searchParams.get("hours") === "ongoing") {
              return session.meeting_status === "ongoing";
            } else if (searchParams.get("hours") === "upcoming") {
              return session.meeting_status === "active";
            } else if (searchParams.get("hours") === "hosted") {
              return session.meeting_status === "inactive";
            }
          });
          setSessionDetails(filteredSessions);
          setDataLoading(false);
        } else if (searchParams.get("hours") === "attended") {
          const filteredSessions = resultData.filter((session: Session) => {
            return session.attendees.some(
              (attendee: any) =>
                attendee.attendee_address === props.individualDelegate
            );
          });
          setSessionDetails(filteredSessions);
          setDataLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchParams.get("hours")]); // Re-fetch data when filter changes

  useEffect(() => {
    // Set initial session details
    setSessionDetails([]);
    // setDataLoading(true);
  }, [props]);

  return (
    <div>
      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-2 border-gray-400 px-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#A7DBF2] font-medium"
                : "text-white"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=ongoing")
            }
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#A7DBF2] font-medium"
                : "text-white"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=upcoming")
            }
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "hosted"
                ? "text-[#A7DBF2] font-medium"
                : "text-white"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=hosted")
            }
          >
            Hosted
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "attended"
                ? "text-[#A7DBF2] font-medium"
                : "text-white"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=attended")
            }
          >
            Attended
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("hours") === "ongoing" &&
            (dataLoading ? (
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
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Ongoing"
                isOfficeHour={true}
              />
            ))}
          {searchParams.get("hours") === "upcoming" &&
            (dataLoading ? (
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
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Upcoming"
                isOfficeHour={true}
              />
            ))}
          {searchParams.get("hours") === "hosted" &&
            (dataLoading ? (
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
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={true}
              />
            ))}
          {searchParams.get("hours") === "attended" &&
            (dataLoading ? (
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
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={true}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default DelegateOfficeHrs;
