interface SVGIconProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MailIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M21.9855 6.99536L13.0004 12.7186C12.6955 12.8957 12.3491 12.989 11.9965 12.989C11.6439 12.989 11.2976 12.8957 10.9927 12.7186L1.99854 6.99536" stroke={color} strokeWidth="1.9987" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.9868 3.99731H3.99723C2.89338 3.99731 1.99854 4.89216 1.99854 5.99601V17.9882C1.99854 19.092 2.89338 19.9869 3.99723 19.9869H19.9868C21.0907 19.9869 21.9855 19.092 21.9855 17.9882V5.99601C21.9855 4.89216 21.0907 3.99731 19.9868 3.99731Z" stroke={color} strokeWidth="1.9987" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

const UploadIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 3V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8L12 3L7 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const ArrowIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M4.99902 11.998H18.9969" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.998 5L18.997 11.9989L11.998 18.9979" stroke={color} strokeWidth="1.9997" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowHeadIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
    <path d="M6.25 18.4937L8.0125 20.2562L15 13.2812L21.9875 20.2562L23.75 18.4937L15 9.74365L6.25 18.4937Z" fill={color} />
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

const CircledXIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
    <path d="M14.0002 25.6673C20.4435 25.6673 25.6668 20.444 25.6668 14.0007C25.6668 7.55733 20.4435 2.33398 14.0002 2.33398C7.55684 2.33398 2.3335 7.55733 2.3335 14.0007C2.3335 20.444 7.55684 25.6673 14.0002 25.6673Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.5 10.5L10.5 17.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.5L17.5 17.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5L15 15" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
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

const WifiIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 20H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8.81966C4.75011 6.35989 8.31034 5 12 5C15.6897 5 19.2499 6.35989 22 8.81966" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12.8586C6.86929 11.0263 9.38247 10 12 10C14.6175 10 17.1307 11.0263 19 12.8586" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 16.4293C9.43464 15.5132 10.6912 15 12 15C13.3088 15 14.5654 15.5132 15.5 16.4293" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NoWifiIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M16 26.667H16.0133" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.3335 21.9057C12.5797 20.6842 14.2551 20 16.0002 20C17.7452 20 19.4206 20.6842 20.6668 21.9057" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.6665 17.1453C8.55721 15.2918 10.9569 14.0432 13.5598 13.5586" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.3332 17.1449C24.5304 16.3579 23.6313 15.6756 22.6572 15.1143" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.6665 11.7603C4.3153 10.2858 6.19729 9.09493 8.23584 8.23633" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29.3334 11.7596C27.2997 9.94064 24.9153 8.55708 22.327 7.694C19.7386 6.83092 17.0011 6.50656 14.2827 6.74089" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.6665 2.66699L29.3332 29.3337" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
    <path d="M10 5V10L13.3333 11.6667" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M2.7493 16.4645C2.63817 16.1651 2.63817 15.8358 2.7493 15.5365C3.83156 12.9123 5.66865 10.6685 8.02766 9.08968C10.3867 7.51082 13.1614 6.66797 16 6.66797C18.8386 6.66797 21.6133 7.51082 23.9723 9.08968C26.3313 10.6685 28.1684 12.9123 29.2506 15.5365C29.3617 15.8358 29.3617 16.1651 29.2506 16.4645C28.1684 19.0887 26.3313 21.3324 23.9723 22.9113C21.6133 24.4901 18.8386 25.333 16 25.333C13.1614 25.333 10.3867 24.4901 8.02766 22.9113C5.66865 21.3324 3.83156 19.0887 2.7493 16.4645Z" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorOutlineIcon = ({ color = "currentColor", width = 24, height = 24, className, style }: SVGIconProps) => (
  <svg width={width} height={height} className={className} style={{ display: "block", flexShrink: 0, ...style }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M15.9998 29.3327C23.3636 29.3327 29.3332 23.3631 29.3332 15.9993C29.3332 8.63555 23.3636 2.66602 15.9998 2.66602C8.63604 2.66602 2.6665 8.63555 2.6665 15.9993C2.6665 23.3631 8.63604 29.3327 15.9998 29.3327Z" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10.666V15.9993" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 21.334H16.0133" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashboardIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M10.5 3.5H4.66667C4.02233 3.5 3.5 4.02233 3.5 4.66667V12.8333C3.5 13.4777 4.02233 14 4.66667 14H10.5C11.1443 14 11.6667 13.4777 11.6667 12.8333V4.66667C11.6667 4.02233 11.1443 3.5 10.5 3.5Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.3333 3.5H17.5C16.8557 3.5 16.3333 4.02233 16.3333 4.66667V8.16667C16.3333 8.811 16.8557 9.33333 17.5 9.33333H23.3333C23.9777 9.33333 24.5 8.811 24.5 8.16667V4.66667C24.5 4.02233 23.9777 3.5 23.3333 3.5Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.3333 14H17.5C16.8557 14 16.3333 14.5223 16.3333 15.1667V23.3333C16.3333 23.9777 16.8557 24.5 17.5 24.5H23.3333C23.9777 24.5 24.5 23.9777 24.5 23.3333V15.1667C24.5 14.5223 23.9777 14 23.3333 14Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 18.6667H4.66667C4.02233 18.6667 3.5 19.189 3.5 19.8333V23.3333C3.5 23.9777 4.02233 24.5 4.66667 24.5H10.5C11.1443 24.5 11.6667 23.9777 11.6667 23.3333V19.8333C11.6667 19.189 11.1443 18.6667 10.5 18.6667Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardapiosIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M14 8.16667V24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 21C3.19058 21 2.89383 20.8771 2.67504 20.6583C2.45625 20.4395 2.33333 20.1428 2.33333 19.8333V4.66667C2.33333 4.35725 2.45625 4.0605 2.67504 3.84171C2.89383 3.62292 3.19058 3.5 3.5 3.5H9.33333C10.571 3.5 11.758 3.99167 12.6332 4.86683C13.5083 5.742 14 6.92899 14 8.16667C14 6.92899 14.4917 5.742 15.3668 4.86683C16.242 3.99167 17.429 3.5 18.6667 3.5H24.5C24.8094 3.5 25.1062 3.62292 25.325 3.84171C25.5438 4.0605 25.6667 4.35725 25.6667 4.66667V19.8333C25.6667 20.1428 25.5438 20.4395 25.325 20.6583C25.1062 20.8771 24.8094 21 24.5 21H17.5C16.5717 21 15.6815 21.3687 15.0251 22.0251C14.3687 22.6815 14 23.5717 14 24.5C14 23.5717 13.6313 22.6815 12.9749 22.0251C12.3185 21.3687 11.4283 21 10.5 21H3.5Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EstoqueIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M12.8333 25.3517C13.188 25.5565 13.5904 25.6643 14 25.6643C14.4096 25.6643 14.812 25.5565 15.1667 25.3517L23.3333 20.685C23.6877 20.4804 23.982 20.1862 24.1868 19.832C24.3916 19.4777 24.4996 19.0758 24.5 18.6667V9.33333C24.4996 8.92415 24.3916 8.52227 24.1868 8.16802C23.982 7.81376 23.6877 7.51958 23.3333 7.31499L15.1667 2.64833C14.812 2.44353 14.4096 2.33572 14 2.33572C13.5904 2.33572 13.188 2.44353 12.8333 2.64833L4.66667 7.31499C4.31231 7.51958 4.01798 7.81376 3.81321 8.16802C3.60843 8.52227 3.50042 8.92415 3.5 9.33333V18.6667C3.50042 19.0758 3.60843 19.4777 3.81321 19.832C4.01798 20.1862 4.31231 20.4804 4.66667 20.685L12.8333 25.3517Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 25.6667V14" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.83833 8.16667L14 14L24.1617 8.16667" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.75 4.98165L19.25 10.99" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefeicoesIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M3.5 2.33333V10.5C3.5 11.7833 4.55 12.8333 5.83333 12.8333H10.5C11.1188 12.8333 11.7123 12.5875 12.1499 12.1499C12.5875 11.7123 12.8333 11.1188 12.8333 10.5V2.33333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.16667 2.33333V25.6667" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24.5 17.5V2.33333C22.9529 2.33333 21.4692 2.94791 20.3752 4.04188C19.2812 5.13584 18.6667 6.61957 18.6667 8.16667V15.1667C18.6667 16.45 19.7167 17.5 21 17.5H24.5ZM24.5 17.5V25.6667" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SolicitacoesExtrasIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M17.0703 2.27604H10.2422C9.61368 2.27604 9.10417 2.78555 9.10417 3.41406V5.6901C9.10417 6.31862 9.61368 6.82813 10.2422 6.82813H17.0703C17.6988 6.82813 18.2083 6.31862 18.2083 5.6901V3.41406C18.2083 2.78555 17.6988 2.27604 17.0703 2.27604Z" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.2083 4.55208H20.4844C21.088 4.55208 21.6669 4.79188 22.0938 5.21872C22.5206 5.64556 22.7604 6.22448 22.7604 6.82813V22.7604C22.7604 23.3641 22.5206 23.943 22.0938 24.3698C21.6669 24.7967 21.088 25.0365 20.4844 25.0365H6.82813C6.22448 25.0365 5.64556 24.7967 5.21872 24.3698C4.79188 23.943 4.55208 23.3641 4.55208 22.7604V6.82813C4.55208 6.22448 4.79188 5.64556 5.21872 5.21872C5.64556 4.79188 6.22448 4.55208 6.82813 4.55208H9.10417" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.6562 12.5182H18.2083" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.6562 18.2083H18.2083" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.10417 12.5182H9.11555" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.10417 18.2083H9.11555" stroke={color} strokeWidth="2.27604" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RelatoriosIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M3.5 3.5V22.1667C3.5 22.7855 3.74583 23.379 4.18342 23.8166C4.621 24.2542 5.21449 24.5 5.83333 24.5H24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 19.8333V10.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.1667 19.8333V5.83333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.33333 19.8333V16.3333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsuariosIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M18.6667 24.5V22.1667C18.6667 20.929 18.175 19.742 17.2998 18.8668C16.4247 17.9917 15.2377 17.5 14 17.5H7C5.76232 17.5 4.57534 17.9917 3.70017 18.8668C2.825 19.742 2.33333 20.929 2.33333 22.1667V24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6667 3.64932C19.6674 3.90875 20.5536 4.49313 21.1863 5.31073C21.819 6.12833 22.1622 7.13286 22.1622 8.16666C22.1622 9.20045 21.819 10.205 21.1863 11.0226C20.5536 11.8402 19.6674 12.4246 18.6667 12.684" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.6667 24.5V22.1667C25.6659 21.1327 25.3217 20.1282 24.6883 19.311C24.0548 18.4938 23.1678 17.9102 22.1667 17.6517" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 12.8333C13.0773 12.8333 15.1667 10.744 15.1667 8.16667C15.1667 5.58934 13.0773 3.5 10.5 3.5C7.92267 3.5 5.83333 5.58934 5.83333 8.16667C5.83333 10.744 7.92267 12.8333 10.5 12.8333Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TerminalIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M23.3333 3.5H4.66667C3.378 3.5 2.33333 4.54467 2.33333 5.83333V17.5C2.33333 18.7887 3.378 19.8333 4.66667 19.8333H23.3333C24.622 19.8333 25.6667 18.7887 25.6667 17.5V5.83333C25.6667 4.54467 24.622 3.5 23.3333 3.5Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.33333 24.5H18.6667" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 19.8333V24.5" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PerfisPermissoesIcon = ({ color = "currentColor", width = 26.25, height = 26.25, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M21.875 14.2188C21.875 19.6875 18.0469 22.4219 13.4969 24.0078C13.2586 24.0886 12.9998 24.0847 12.7641 23.9969C8.20312 22.4219 4.375 19.6875 4.375 14.2188V6.56252C4.375 6.27244 4.49023 5.99424 4.69535 5.78913C4.90047 5.58401 5.17867 5.46877 5.46875 5.46877C7.65625 5.46877 10.3906 4.15627 12.2937 2.49377C12.5255 2.2958 12.8202 2.18703 13.125 2.18703C13.4298 2.18703 13.7245 2.2958 13.9563 2.49377C15.8703 4.16721 18.5938 5.46877 20.7812 5.46877C21.0713 5.46877 21.3495 5.58401 21.5546 5.78913C21.7598 5.99424 21.875 6.27244 21.875 6.56252V14.2188Z" stroke={color} strokeWidth="2.1875" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogsAuditoriaIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M17.5 2.33333H7C6.38116 2.33333 5.78767 2.57917 5.35008 3.01675C4.9125 3.45434 4.66667 4.04783 4.66667 4.66667V23.3333C4.66667 23.9522 4.9125 24.5457 5.35008 24.9833C5.78767 25.4208 6.38116 25.6667 7 25.6667H21C21.6188 25.6667 22.2123 25.4208 22.6499 24.9833C23.0875 24.5457 23.3333 23.9522 23.3333 23.3333V8.16667L17.5 2.33333Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.3333 2.33333V7C16.3333 7.61884 16.5792 8.21233 17.0168 8.64992C17.4543 9.0875 18.0478 9.33333 18.6667 9.33333H23.3333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6667 10.5H9.33333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6667 15.1667H9.33333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6667 19.8333H9.33333" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConfiguracoesIcon = ({ color = "currentColor", width = 28, height = 28, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M11.2828 4.82537C11.3471 4.1491 11.6612 3.52109 12.1638 3.06403C12.6663 2.60697 13.3213 2.3537 14.0006 2.3537C14.6799 2.3537 15.3348 2.60697 15.8374 3.06403C16.3399 3.52109 16.6541 4.1491 16.7183 4.82537C16.757 5.26223 16.9003 5.68336 17.1362 6.0531C17.372 6.42284 17.6935 6.73031 18.0734 6.94949C18.4532 7.16867 18.8803 7.2931 19.3185 7.31226C19.7566 7.33141 20.1929 7.24473 20.5905 7.05953C21.2078 6.77928 21.9073 6.73872 22.5528 6.94577C23.1984 7.15281 23.7438 7.59264 24.0829 8.17966C24.4221 8.76667 24.5307 9.45887 24.3876 10.1215C24.2445 10.7842 23.86 11.3699 23.3088 11.7647C22.9499 12.0165 22.657 12.3511 22.4547 12.7401C22.2525 13.1291 22.1469 13.561 22.1469 13.9995C22.1469 14.4379 22.2525 14.8699 22.4547 15.2588C22.657 15.6478 22.9499 15.9824 23.3088 16.2342C23.86 16.629 24.2445 17.2147 24.3876 17.8774C24.5307 18.54 24.4221 19.2322 24.0829 19.8192C23.7438 20.4063 23.1984 20.8461 22.5528 21.0531C21.9073 21.2602 21.2078 21.2196 20.5905 20.9394C20.1929 20.7542 19.7566 20.6675 19.3185 20.6866C18.8803 20.7058 18.4532 20.8302 18.0734 21.0494C17.6935 21.2686 17.372 21.5761 17.1362 21.9458C16.9003 22.3155 16.757 22.7367 16.7183 23.1735C16.6541 23.8498 16.3399 24.4778 15.8374 24.9349C15.3348 25.3919 14.6799 25.6452 14.0006 25.6452C13.3213 25.6452 12.6663 25.3919 12.1638 24.9349C11.6612 24.4778 11.3471 23.8498 11.2828 23.1735C11.2443 22.7365 11.1009 22.3152 10.865 21.9454C10.6291 21.5755 10.3075 21.2679 9.92744 21.0487C9.54741 20.8295 9.12015 20.7051 8.68184 20.6861C8.24354 20.6671 7.8071 20.7539 7.4095 20.9394C6.7922 21.2196 6.09271 21.2602 5.44717 21.0531C4.80162 20.8461 4.2562 20.4063 3.91706 19.8192C3.57793 19.2322 3.46933 18.54 3.61242 17.8774C3.75551 17.2147 4.14003 16.629 4.69117 16.2342C5.05006 15.9824 5.34302 15.6478 5.54527 15.2588C5.74752 14.8699 5.85311 14.4379 5.85311 13.9995C5.85311 13.561 5.74752 13.1291 5.54527 12.7401C5.34302 12.3511 5.05006 12.0165 4.69117 11.7647C4.14081 11.3697 3.75696 10.7842 3.61422 10.122C3.47148 9.4598 3.58004 8.76817 3.91881 8.18153C4.25759 7.5949 4.80236 7.15518 5.44727 6.94782C6.09218 6.74046 6.79115 6.78027 7.40833 7.05953C7.80588 7.24473 8.2422 7.33141 8.68035 7.31226C9.1185 7.2931 9.54559 7.16867 9.92546 6.94949C10.3053 6.73031 10.6268 6.42284 10.8627 6.0531C11.0985 5.68336 11.2419 5.26223 11.2805 4.82537" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 17.5C15.933 17.5 17.5 15.933 17.5 14C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14C10.5 15.933 12.067 17.5 14 17.5Z" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SairIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M67.9983 8H27.9993C23.5811 8 19.9995 11.5816 19.9995 15.9998V79.9981C19.9995 84.4163 23.5811 87.9979 27.9993 87.9979H67.9983C72.4164 87.9979 75.998 84.4163 75.998 79.9981V15.9998C75.998 11.5816 72.4164 8 67.9983 8Z" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M48 72H48.04" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QRCodeIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M14 6H8C6.89543 6 6 6.89543 6 8V14C6 15.1046 6.89543 16 8 16H14C15.1046 16 16 15.1046 16 14V8C16 6.89543 15.1046 6 14 6Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 6H34C32.8954 6 32 6.89543 32 8V14C32 15.1046 32.8954 16 34 16H40C41.1046 16 42 15.1046 42 14V8C42 6.89543 41.1046 6 40 6Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 32H8C6.89543 32 6 32.8954 6 34V40C6 41.1046 6.89543 42 8 42H14C15.1046 42 16 41.1046 16 40V34C16 32.8954 15.1046 32 14 32Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 32H36C34.9391 32 33.9217 32.4214 33.1716 33.1716C32.4214 33.9217 32 34.9391 32 36V42" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 42V42.02" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 14V20C24 21.0609 23.5786 22.0783 22.8284 22.8284C22.0783 23.5786 21.0609 24 20 24H14" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 24H6.02" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 6H24.02" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 32V32.02" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 24H34" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 24V24.02" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 42V40" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M40 10H8C5.79086 10 4 11.7909 4 14V34C4 36.2091 5.79086 38 8 38H40C42.2091 38 44 36.2091 44 34V14C44 11.7909 42.2091 10 40 10Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 20H44" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImageIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M38 6H10C7.79086 6 6 7.79086 6 10V38C6 40.2091 7.79086 42 10 42H38C40.2091 42 42 40.2091 42 38V10C42 7.79086 40.2091 6 38 6Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 29.9999L35.828 23.8279C35.0779 23.078 34.0607 22.6567 33 22.6567C31.9393 22.6567 30.9221 23.078 30.172 23.8279L12 41.9999" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M10.665 2.66797V8.0005" stroke={color} strokeWidth="2.66626" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21.3301 2.66797V8.0005" stroke={color} strokeWidth="2.66626" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.3296 5.33203H6.66578C5.19324 5.33203 3.99951 6.52576 3.99951 7.99829V26.6621C3.99951 28.1347 5.19324 29.3284 6.66578 29.3284H25.3296C26.8022 29.3284 27.9959 28.1347 27.9959 26.6621V7.99829C27.9959 6.52576 26.8022 5.33203 25.3296 5.33203Z" stroke={color} strokeWidth="2.66626" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.99951 13.332H27.9959" stroke={color} strokeWidth="2.66626" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MarkedCalendarIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M15.8333 3.33203H4.16667C3.24619 3.33203 2.5 4.07822 2.5 4.9987V16.6654C2.5 17.5858 3.24619 18.332 4.16667 18.332H15.8333C16.7538 18.332 17.5 17.5858 17.5 16.6654V4.9987C17.5 4.07822 16.7538 3.33203 15.8333 3.33203Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3335 1.66797V5.0013" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.33203H17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.6665 1.66797V5.0013" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.1665 11.668H9.1665" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.8335 15H5.8335" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.8335 11.668H5.84183" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.1665 15H14.1748" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CookHatIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M17 21.0002C17.2652 21.0002 17.5196 20.8948 17.7071 20.7073C17.8947 20.5197 18 20.2654 18 20.0002V14.6502C18 14.1932 18.316 13.8062 18.727 13.6092C19.578 13.2032 20.2582 12.5097 20.6476 11.651C21.0371 10.7924 21.1107 9.82375 20.8554 8.91611C20.6002 8.00847 20.0326 7.22016 19.2527 6.6903C18.4728 6.16044 17.5309 5.92309 16.593 6.02015C16.2068 5.12236 15.5659 4.35745 14.7496 3.81999C13.9333 3.28253 12.9774 2.99609 12 2.99609C11.0227 2.99609 10.0668 3.28253 9.25045 3.81999C8.43415 4.35745 7.79326 5.12236 7.40702 6.02015C6.4696 5.92377 5.52826 6.16145 4.74895 6.69129C3.96965 7.22112 3.40243 8.00909 3.14731 8.91625C2.89218 9.82342 2.96553 10.7915 3.35443 11.6499C3.74332 12.5083 4.42278 13.2018 5.27302 13.6082C5.68402 13.8062 6.00002 14.1932 6.00002 14.6492V20.0002C6.00002 20.2654 6.10538 20.5197 6.29291 20.7073C6.48045 20.8948 6.7348 21.0002 7.00002 21.0002H17Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 17H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StatsIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M3 3V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 17V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 17V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 17V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = ({ color = "currentColor", width = 24, height = 24, className }: SVGIconProps) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block", flexShrink: 0 }}>
    <path d="M16.6665 6.66797H8.33317C7.4127 6.66797 6.6665 7.41416 6.6665 8.33464V16.668C6.6665 17.5884 7.4127 18.3346 8.33317 18.3346H16.6665C17.587 18.3346 18.3332 17.5884 18.3332 16.668V8.33464C18.3332 7.41416 17.587 6.66797 16.6665 6.66797Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.33317 13.3346C2.4165 13.3346 1.6665 12.5846 1.6665 11.668V3.33464C1.6665 2.41797 2.4165 1.66797 3.33317 1.66797H11.6665C12.5832 1.66797 13.3332 2.41797 13.3332 3.33464" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export {
  MailIcon,
  DownloadIcon,
  UploadIcon,
  ArrowIcon,
  ArrowHeadIcon,
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
  CircledXIcon,
  CheckIcon,
  XIcon,
  TrashIcon,
  BuildingIcon,
  LockIcon,
  NoWifiIcon,
  WifiIcon,
  ClockIcon,
  EyeIcon,
  ErrorOutlineIcon,
  DashboardIcon,
  CardapiosIcon,
  EstoqueIcon,
  RefeicoesIcon,
  SolicitacoesExtrasIcon,
  RelatoriosIcon,
  UsuariosIcon,
  TerminalIcon,
  PerfisPermissoesIcon,
  LogsAuditoriaIcon,
  ConfiguracoesIcon,
  SairIcon,
  PhoneIcon,
  QRCodeIcon,
  CardIcon,
  ImageIcon,
  CalendarIcon,
  MarkedCalendarIcon,
  CookHatIcon,
  StatsIcon,
  CopyIcon,
};
