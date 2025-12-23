import {
  LuUserPlus,
  LuLogIn,
  LuUpload,
  LuEye,
  LuEyeClosed,
} from "react-icons/lu";

import { FiBookOpen, FiLock } from "react-icons/fi";

import { MdOutlineEmail } from "react-icons/md";

interface SVGIconProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

const DownloadIcon = ({ color = "#FFFFFF", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = ({ color = "#FFFFFF", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99902 11.998H18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.998 5L18.997 11.9989L11.998 18.9979" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = ({ color = "#FFFFFF", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 22V2H16V4H14V8H18V6H20V22H4ZM12 4H6V20H18V10H12V4Z" fill={color} />
    <path d="M18 6H16V4H18V6Z" fill={color} />
  </svg>
);

const CSVIcon = ({ color = "#FFFFFF", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 22V2H16V4H14V8H18V6H20V22H4ZM12 4H6V20H18V10H12V4Z" fill={color} />
    <path d="M18 6H16V4H18V6Z" fill={color} />
    <path d="M13 12H15V14H13V12Z" fill={color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M13 16V14H11V12H9V14H11V16H9V18H11V16H13ZM13 16V18H15V16H13Z" fill={color} />
  </svg>
);


export {
  LuUserPlus,
  LuLogIn,
  LuUpload,
  LuEye,
  LuEyeClosed,
  FiBookOpen,
  MdOutlineEmail,
  FiLock,
  DownloadIcon,
  ArrowIcon,
  FileIcon,
  CSVIcon
};
