const moment=require('moment');
function formatMessages(userName,text){
	return{
		userName,
		text,
		time:moment().format('h:mm a')
	}

}
module.exports=formatMessages;