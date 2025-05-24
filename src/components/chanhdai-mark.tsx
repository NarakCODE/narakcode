export function NarakCODEMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 256H64v-64h128v64ZM448 64H320v128h128v64H256V0h192v64ZM64 192H0V64h64v128ZM512 192h-64V64h64v128ZM192 64H64V0h128v64Z"
      />
    </svg>
  );
}
