export default function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
export const getInitials=(Uname)=>{
  if(!Uname)return "";
  const words=Uname.split(" ");
  let Initials=" ";

  for(let i=0;i<Math.min(words.length,2);i++){
    Initials+=words[i][0];
  }
  return Initials
}