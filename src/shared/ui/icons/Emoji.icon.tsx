export const EmojiIcon: React.FC = () => {
   return (
      <svg
         viewBox="0 0 18 18"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true"
      >
         <circle
            cx="9"
            cy="9"
            r="7.5"
            stroke="currentColor"
            strokeWidth="1.5"
         />

         <circle cx="6.5" cy="7" r="0.75" fill="currentColor" />
         <circle cx="11.5" cy="7" r="0.75" fill="currentColor" />

         <path
            d="M6.5 11.25C7.1 11.95 7.95 12.3 9 12.3C10.05 12.3 10.9 11.95 11.5 11.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
         />
      </svg>
   );
};