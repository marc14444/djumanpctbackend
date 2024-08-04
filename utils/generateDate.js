//FONCTION POUR GENERER LA DATE
const theDate = () => {
  const today = new Date();

  // Fonction pour ajouter un zéro devant les chiffres qui sont seuls
  // Exemple : 1 => 01
  //padStart permet d'ajouter un 0 devant les chiffres
  const addLeadingZero = (number) => number.toString().padStart(2, "0");

  const thisDate = `${addLeadingZero(today.getDate())}/${addLeadingZero(
    today.getMonth() + 1
  )}/${today.getFullYear()}  ${addLeadingZero(
    today.getHours()
  )}:${addLeadingZero(today.getMinutes())}:${addLeadingZero(
    today.getSeconds()
  )}`;

  return thisDate;
};

export default theDate;
