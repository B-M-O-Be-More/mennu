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

const UsuariosCheckIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M18.6665 12.8333L20.9998 15.1667L25.6665 10.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6668 24.5V22.1667C18.6668 20.929 18.1752 19.742 17.3 18.8668C16.4248 17.9917 15.2378 17.5 14.0002 17.5H7.00016C5.76249 17.5 4.5755 17.9917 3.70033 18.8668C2.82516 19.742 2.3335 20.929 2.3335 22.1667V24.5" stroke="#00A63E" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.5002 12.8333C13.0775 12.8333 15.1668 10.744 15.1668 8.16667C15.1668 5.58934 13.0775 3.5 10.5002 3.5C7.92283 3.5 5.8335 5.58934 5.8335 8.16667C5.8335 10.744 7.92283 12.8333 10.5002 12.8333Z" stroke="#00A63E" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const UsuariosXIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M18.6668 24.5V22.1667C18.6668 20.929 18.1752 19.742 17.3 18.8668C16.4248 17.9917 15.2378 17.5 14.0002 17.5H7.00016C5.76249 17.5 4.5755 17.9917 3.70033 18.8668C2.82516 19.742 2.3335 20.929 2.3335 22.1667V24.5" stroke="#E7000B" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.5002 12.8333C13.0775 12.8333 15.1668 10.744 15.1668 8.16667C15.1668 5.58934 13.0775 3.5 10.5002 3.5C7.92283 3.5 5.8335 5.58934 5.8335 8.16667C5.8335 10.744 7.92283 12.8333 10.5002 12.8333Z" stroke="#E7000B" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.8335 9.33301L25.6668 15.1663" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.6668 9.33301L19.8335 15.1663" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99902 11.998H18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.998 5L18.997 11.9989L11.998 18.9979" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 22V2H16V4H14V8H18V6H20V22H4ZM12 4H6V20H18V10H12V4Z" fill={color} />
    <path d="M18 6H16V4H18V6Z" fill={color} />
  </svg>
);

const PlusIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99927 11.998H18.9972" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.9983 4.99902V18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FilterIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M9.99843 19.9974C9.99834 20.1832 10.05 20.3654 10.1477 20.5235C10.2454 20.6815 10.3851 20.8092 10.5513 20.8923L12.551 21.8921C12.7035 21.9683 12.8729 22.0043 13.0432 21.9966C13.2135 21.9889 13.379 21.9377 13.5239 21.8481C13.6689 21.7584 13.7885 21.6332 13.8715 21.4843C13.9544 21.3354 13.9979 21.1677 13.9978 20.9973V13.9983C13.9981 13.5028 14.1823 13.025 14.5147 12.6575L21.7367 4.66975C21.8661 4.52633 21.9512 4.34848 21.9817 4.15771C22.0122 3.96694 21.9868 3.77142 21.9085 3.59478C21.8303 3.41815 21.7025 3.26798 21.5407 3.16243C21.3789 3.05687 21.19 3.00046 20.9968 3H2.99949C2.80612 3.00007 2.61693 3.05621 2.45482 3.16161C2.29271 3.26702 2.16464 3.41717 2.08613 3.59387C2.00762 3.77058 1.98203 3.96626 2.01246 4.15722C2.0429 4.34817 2.12805 4.5262 2.2576 4.66975L9.48151 12.6575C9.81399 13.025 9.99821 13.5028 9.99843 13.9983V19.9974Z" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M20.9977 20.9972L16.6577 16.6572" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.9983 18.9976C15.4159 18.9976 18.9971 15.4164 18.9971 10.9988C18.9971 6.58118 15.4159 3 10.9983 3C6.58069 3 2.99951 6.58118 2.99951 10.9988C2.99951 15.4164 6.58069 18.9976 10.9983 18.9976" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CSVIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
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
  CSVIcon,
  PlusIcon,
  UsuariosCheckIcon,
  UsuariosXIcon,
  FilterIcon,
  SearchIcon
};
