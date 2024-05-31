import { TypeAnimation } from 'react-type-animation';

const Animation = () => {
  return (
    <TypeAnimation
       sequence={[
        'A towering skyscraper rises above the vast city skyline',
        1000, 
        'A towering skyscraper rises above the endless landscape',
        1000,
        'A towering skyscraper rises above the futuristic civilization',
        1000
      ]}
      wrapper="span"
      speed={50}
      style={{ 
        paddingLeft: '75px',
        fontSize: '1.6em', 
        display: 'inline-block', 
        fontFamily: 'Papyrus',
        color: 'blue',
        textAlign: 'center',
        alignItems: 'center'
         }}
      repeat={Infinity}
    />
  );
};

export default Animation;
