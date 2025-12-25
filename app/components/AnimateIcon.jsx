export function AnimateIcon({ children, animateOnHover }) {
  return (
    <div className={ "transition hover:scale-110"}>
      {children}
    </div>
  );
}
