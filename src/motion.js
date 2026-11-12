// Alternate complete entrance treatments; every photograph keeps its own motion.
const treatments = [
  { name:'drift', tilt:-3, duration:1050, start:'translate3d(-70px,38px,0) rotate(-14deg) scale(.86)', middle:'translate3d(8px,-8px,0) rotate(-1deg) scale(1.02)' },
  { name:'unfold', tilt:2, duration:1200, start:'perspective(1000px) rotateY(-65deg) rotateZ(8deg) scale(.84)', middle:'perspective(1000px) rotateY(8deg) rotateZ(0deg) scale(1.01)' },
  { name:'rise', tilt:-1.5, duration:1150, start:'translate3d(0,100px,0) rotate(7deg) scale(.9)', middle:'translate3d(0,-12px,0) rotate(-3deg) scale(1.02)' },
  { name:'reveal', tilt:3, duration:1300, start:'translate3d(18px,0,0) rotate(3deg) scale(1.03)', middle:'translate3d(0,0,0) rotate(3deg) scale(1)' },
  { name:'settle', tilt:-2, duration:1200, start:'translate3d(55px,-60px,0) rotate(17deg) scale(1.14)', middle:'translate3d(-7px,5px,0) rotate(-4deg) scale(.99)' },
];
export function photoMotion(index, origin) {
  const choice = treatments[index % treatments.length];
  const first = { opacity:0, transform:choice.start, filter:'blur(3px)', clipPath:choice.name === 'reveal' ? 'inset(0 100% 0 0)' : 'inset(0)' };
  if (origin) {
    first.transform = `translate3d(${origin.x}px,${origin.y}px,0) rotate(${index%2 ? -16 : 16}deg) scale(${origin.scale})`;
    first.opacity = .35;
  }
  return {
    ...choice,
    frames:[first,
      {opacity:1,transform:choice.middle,filter:'blur(0)',clipPath:'inset(0)',offset:.76},
      {opacity:1,transform:`rotate(${choice.tilt}deg)`,filter:'blur(0)',clipPath:'inset(0)'},
    ],
  };
}
