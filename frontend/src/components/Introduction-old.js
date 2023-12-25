import Typography from '@material-ui/core/Typography';
import './Introduction.css'



const introParagraph = "Welcome to Watching the Watchmen! We aim to provide citizens information about our legislators in Congress and insights into how and what they are voting on.";
const paragraphTwo = "We provide two tools: the Votes Dashboard and the Legislator Lookup Tool. The dashboard tracks the 20 most recent votes of both the House of Representatives and Senate, and you can learn the outcome of the vote, the breakdown of the vote by party, and how a specific legislator voted. You can use the lookup tool to learn the voting tendency of a specific legislator and other pertinent information like that legislator's party or contact information."
const paragraphThree = "The data provided is gathered via the ProPublica Congress API, and the images are gathered through the Images of Congress repository on GitHub. These sources get their data from publicly available sources."
const paragraphFour = "If you have questions or encounter any issues, you can email us at: scott_hung@aol.com. We will get back to you as soon as we can!"  

export default function Introduction(){

  return (
    <div id="introductionContainer">
      <Typography variant='h3' paragraph={true}>Introduction</Typography>
      <div id="introText">
        <Typography variant='body1' paragraph={true} style={{fontSize: '1.5rem'}}>{introParagraph}</Typography>
        <Typography variant='body1' paragraph={true} style={{fontSize: '1.5rem'}}>{paragraphTwo}</Typography>
        <Typography variant='body1' paragraph={true} style={{fontSize: '1.5rem'}}>{paragraphThree}</Typography>
        <Typography variant='body1' paragraph={true} style={{fontSize: '1.5rem'}}>{paragraphFour}</Typography>
      </div>
    </div>
  );
}