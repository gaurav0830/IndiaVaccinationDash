import { useState, useEffect, useMemo } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconChartBar,
  IconGlobe,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import indiaMapBg from "../assets/india-mapbg.png";
import IndiaMapChart from "./indiaMapChart";
import vaccinationData from "../data/indiaVaccination.json";
import VaccinationBarChart from "./VaccinationBarChart";
import VaccineDoughnutChart from "./VaccineDoughnutChart";
import RangeBarChart from "./RangeBarChart ";
import GeoLoader from "./GeoLoader";

export default function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Vaccination Data",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-foreground" />,
    },
  ];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <GeoLoader size={150} />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex w-full h-screen overflow-hidden bg-gray-100 ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo open={true} /> : <Logo open={false} />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Gaurav R",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-medium">
                      GR
                    </span>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard data={vaccinationData} />
    </div>
  );
}

export const Logo = ({ open }) => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary flex items-center justify-center text-black text-xs font-bold">
        IVD
      </div>

      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-foreground"
        >
          INDIAVD
        </motion.span>
      )}
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
    </a>
  );
};

const Dashboard = ({ data }) => {
  const [hoveredState, setHoveredState] = useState(null);

  const topStates = useMemo(() => {
    return [...data]
      .map((s) => ({
        ...s,
        // compute from numeric data to be accurate
        percent: (s.vaccinated / s.population) * 100,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4);
  }, [data]);

  const chartData = useMemo(() => {
    const parseRate = (rate) => {
      if (!rate) return 0;
      if (typeof rate === "string") return parseFloat(rate.replace("%", ""));
      return rate;
    };

    const maxRate = Math.max(...data.map((s) => parseRate(s.vaccination_rate)));

    if (hoveredState) {
      return [
        {
          ...hoveredState,
          percent: (parseRate(hoveredState.vaccination_rate) / maxRate) * 100,
          vaccinated: hoveredState.vaccinated || 0, 
        },
      ];
    }

    return topStates.map((s) => ({
      ...s,
      percent: (parseRate(s.vaccination_rate) / maxRate) * 100,
      vaccinated: s.vaccinated || 0, 
    }));
  }, [hoveredState, topStates, data]);

  const maxRateValue = Math.max(
    ...data.map((s) => parseFloat(s.vaccination_rate))
  );

  return (
    <div className="flex flex-1">
      <div
        className="flex h-full w-full flex-1 flex-col gap-4 p-2 md:p-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.6), rgba(0,0,0,0.95)), url(${indiaMapBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="flex flex-1 gap-4 w-full">
          <div className="flex-1 flex flex-col gap-4">
            <RangeBarChart
              data={chartData}
              maxValue={maxRateValue}
              title={
                hoveredState
                  ? `${hoveredState.state} Vaccination`
                  : "Welcome User 👋"
              }
              subtitle={
                hoveredState
                  ? `Coverage rate: ${hoveredState.vaccination_rate}`
                  : "The top states with the highest vaccination coverage."
              }
              colors={["#34d399", "#3b82f6", "#f97316", "#f43f5e"]}
              barWidth={180}
              animationDuration={1200}
            />

            <div className="flex flex-wrap md:flex-nowrap gap-4 mt-auto">
              <div className="flex-1 rounded-2xl bg-white/40 p-4 backdrop-blur-md h-[280px] shadow-lg border border-white/20">
                <VaccinationBarChart hoveredState={hoveredState} />
              </div>
              <div className="flex-1 rounded-2xl bg-white/40 p-4 backdrop-blur-md h-[280px] shadow-lg border border-white/20">
                <VaccineDoughnutChart hoveredState={hoveredState} />
              </div>
            </div>
          </div>

          <div className="w-full md:w-[40%] rounded-2xl bg-white/30 backdrop-blur-md relative overflow-hidden h-full shadow-lg border border-white/20 p-3">
            <IndiaMapChart
              geoUrl="/india-states.geojson"
              data={data}
              colorRange={["#d0f1c9", "#034a21"]}
              onHover={(stateData) => setHoveredState(stateData)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
