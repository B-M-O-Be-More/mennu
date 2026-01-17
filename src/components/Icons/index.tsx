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
  style?: React.CSSProperties;
}

const UsuariosCheckIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M18.6665 12.8333L20.9998 15.1667L25.6665 10.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6668 24.5V22.1667C18.6668 20.929 18.1752 19.742 17.3 18.8668C16.4248 17.9917 15.2378 17.5 14.0002 17.5H7.00016C5.76249 17.5 4.5755 17.9917 3.70033 18.8668C2.82516 19.742 2.3335 20.929 2.3335 22.1667V24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5002 12.8333C13.0775 12.8333 15.1668 10.744 15.1668 8.16667C15.1668 5.58934 13.0775 3.5 10.5002 3.5C7.92283 3.5 5.8335 5.58934 5.8335 8.16667C5.8335 10.744 7.92283 12.8333 10.5002 12.8333Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsuariosXIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M18.6668 24.5V22.1667C18.6668 20.929 18.1752 19.742 17.3 18.8668C16.4248 17.9917 15.2378 17.5 14.0002 17.5H7.00016C5.76249 17.5 4.5755 17.9917 3.70033 18.8668C2.82516 19.742 2.3335 20.929 2.3335 22.1667V24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5002 12.8333C13.0775 12.8333 15.1668 10.744 15.1668 8.16667C15.1668 5.58934 13.0775 3.5 10.5002 3.5C7.92283 3.5 5.8335 5.58934 5.8335 8.16667C5.8335 10.744 7.92283 12.8333 10.5002 12.8333Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.8335 9.33301L25.6668 15.1663" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.6668 9.33301L19.8335 15.1663" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99902 11.998H18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.998 5L18.997 11.9989L11.998 18.9979" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 22V2H16V4H14V8H18V6H20V22H4ZM12 4H6V20H18V10H12V4Z" fill={color} />
    <path d="M18 6H16V4H18V6Z" fill={color} />
  </svg>
);

const PlusIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99927 11.998H18.9972" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.9983 4.99902V18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FilterIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M9.99843 19.9974C9.99834 20.1832 10.05 20.3654 10.1477 20.5235C10.2454 20.6815 10.3851 20.8092 10.5513 20.8923L12.551 21.8921C12.7035 21.9683 12.8729 22.0043 13.0432 21.9966C13.2135 21.9889 13.379 21.9377 13.5239 21.8481C13.6689 21.7584 13.7885 21.6332 13.8715 21.4843C13.9544 21.3354 13.9979 21.1677 13.9978 20.9973V13.9983C13.9981 13.5028 14.1823 13.025 14.5147 12.6575L21.7367 4.66975C21.8661 4.52633 21.9512 4.34848 21.9817 4.15771C22.0122 3.96694 21.9868 3.77142 21.9085 3.59478C21.8303 3.41815 21.7025 3.26798 21.5407 3.16243C21.3789 3.05687 21.19 3.00046 20.9968 3H2.99949C2.80612 3.00007 2.61693 3.05621 2.45482 3.16161C2.29271 3.26702 2.16464 3.41717 2.08613 3.59387C2.00762 3.77058 1.98203 3.96626 2.01246 4.15722C2.0429 4.34817 2.12805 4.5262 2.2576 4.66975L9.48151 12.6575C9.81399 13.025 9.99821 13.5028 9.99843 13.9983V19.9974Z" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M20.9977 20.9972L16.6577 16.6572" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.9983 18.9976C15.4159 18.9976 18.9971 15.4164 18.9971 10.9988C18.9971 6.58118 15.4159 3 10.9983 3C6.58069 3 2.99951 6.58118 2.99951 10.9988C2.99951 15.4164 6.58069 18.9976 10.9983 18.9976" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CSVIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 22V2H16V4H14V8H18V6H20V22H4ZM12 4H6V20H18V10H12V4Z" fill={color} />
    <path d="M18 6H16V4H18V6Z" fill={color} />
    <path d="M13 12H15V14H13V12Z" fill={color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M13 16V14H11V12H9V14H11V16H9V18H11V16H13ZM13 16V18H15V16H13Z" fill={color} />
  </svg>
);

const UpdateIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.516 3.00947 16.931 3.99122 18.74 5.74L21 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 3V8H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21C9.48395 20.9905 7.06897 20.0088 5.26 18.26L3 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 16H3V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const PaperIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} viewBox="0 0 32 32" fill="none">
    <path d="M28.9734 24.001L18.3067 5.33428C18.0741 4.92389 17.7368 4.58253 17.3293 4.34504C16.9217 4.10755 16.4584 3.98242 15.9867 3.98242C15.515 3.98242 15.0517 4.10755 14.6441 4.34504C14.2366 4.58253 13.8993 4.92389 13.6667 5.33428L3.00003 24.001C2.76494 24.4081 2.64167 24.8702 2.64271 25.3403C2.64375 25.8104 2.76907 26.272 3.00596 26.6781C3.24285 27.0841 3.58289 27.4204 3.99162 27.6527C4.40035 27.885 4.86324 28.0052 5.33336 28.001H26.6667C27.1346 28.0005 27.5941 27.8769 27.9991 27.6427C28.4041 27.4084 28.7403 27.0717 28.974 26.6664C29.2078 26.2611 29.3307 25.8015 29.3306 25.3336C29.3305 24.8657 29.2073 24.4061 28.9734 24.001Z" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 12V17.3333" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 22.666H16.0133" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

const TwistedArrowIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M21.3334 22.666H29.3334V14.666" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29.3333 22.6673L18 11.334L11.3333 18.0007L2.66663 9.33398" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V10" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.3125 2.18769C15.644 1.85617 16.0937 1.66992 16.5625 1.66992C17.0313 1.66992 17.481 1.85617 17.8125 2.18769C18.144 2.51921 18.3303 2.96885 18.3303 3.43769C18.3303 3.90653 18.144 4.35617 17.8125 4.68769L10.3017 12.1994C10.1038 12.3971 9.85933 12.5418 9.59083 12.6202L7.19666 13.3202C7.12496 13.3411 7.04895 13.3424 6.97659 13.3238C6.90423 13.3053 6.83819 13.2676 6.78537 13.2148C6.73255 13.162 6.6949 13.096 6.67637 13.0236C6.65783 12.9512 6.65908 12.8752 6.68 12.8035L7.38 10.4094C7.45877 10.1411 7.60378 9.8969 7.80166 9.69936L15.3125 2.18769Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircledCheckIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M29.0681 13.3333C29.6771 16.3217 29.2431 19.4285 27.8386 22.1357C26.4341 24.8429 24.144 26.9867 21.3502 28.2097C18.5563 29.4328 15.4276 29.661 12.4859 28.8565C9.5441 28.0519 6.96705 26.2632 5.1845 23.7885C3.40195 21.3139 2.52163 18.303 2.69035 15.2578C2.85907 12.2127 4.06664 9.31744 6.11167 7.05488C8.1567 4.79232 10.9156 3.29923 13.9282 2.82459C16.9409 2.34995 20.0252 2.92247 22.6668 4.44665" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14.6673L16 18.6673L29.3333 5.33398" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
    <path d="M8.3335 9.16602V14.166" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6665 9.16602V14.166" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.8332 5V16.6667C15.8332 17.1087 15.6576 17.5326 15.345 17.8452C15.0325 18.1577 14.6085 18.3333 14.1665 18.3333H5.83317C5.39114 18.3333 4.96722 18.1577 4.65466 17.8452C4.3421 17.5326 4.1665 17.1087 4.1665 16.6667V5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5H17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.6665 4.99935V3.33268C6.6665 2.89065 6.8421 2.46673 7.15466 2.15417C7.46722 1.84161 7.89114 1.66602 8.33317 1.66602H11.6665C12.1085 1.66602 12.5325 1.84161 12.845 2.15417C13.1576 2.46673 13.3332 2.89065 13.3332 3.33268V4.99935" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BuildingIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
    <path d="M14 11.667H14.0117" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 16.333H14.0117" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7H14.0117" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6665 11.667H18.6782" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6665 16.333H18.6782" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6665 7H18.6782" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.3335 11.667H9.34516" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.3335 16.333H9.34516" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.3335 7H9.34516" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 25.6667V22.1667C10.5 21.8572 10.6229 21.5605 10.8417 21.3417C11.0605 21.1229 11.3572 21 11.6667 21H16.3333C16.6428 21 16.9395 21.1229 17.1583 21.3417C17.3771 21.5605 17.5 21.8572 17.5 22.1667V25.6667" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.9998 2.33301H6.99984C5.71117 2.33301 4.6665 3.37768 4.6665 4.66634V23.333C4.6665 24.6217 5.71117 25.6663 6.99984 25.6663H20.9998C22.2885 25.6663 23.3332 24.6217 23.3332 23.333V4.66634C23.3332 3.37768 22.2885 2.33301 20.9998 2.33301Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
    <path d="M22.1667 12.833H5.83333C4.54467 12.833 3.5 13.8777 3.5 15.1663V23.333C3.5 24.6217 4.54467 25.6663 5.83333 25.6663H22.1667C23.4553 25.6663 24.5 24.6217 24.5 23.333V15.1663C24.5 13.8777 23.4553 12.833 22.1667 12.833Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.1665 12.833V8.16634C8.1665 6.61924 8.78109 5.13551 9.87505 4.04155C10.969 2.94759 12.4527 2.33301 13.9998 2.33301C15.5469 2.33301 17.0307 2.94759 18.1246 4.04155C19.2186 5.13551 19.8332 6.61924 19.8332 8.16634V12.833" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
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
  SearchIcon,
  UpdateIcon,
  PaperIcon,
  AlertIcon,
  TwistedArrowIcon,
  EditIcon,
  CircledCheckIcon,
  TrashIcon,
  BuildingIcon,
  LockIcon
};
