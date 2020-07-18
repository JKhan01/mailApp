
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-box').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  var formElem = document.getElementById('compose-form');
  if (formElem){
    formElem.addEventListener('submit',sendMail);
  }

  function sendMail()
  {
    var rec = document.getElementById('compose-recipients').value;
    var sub = document.getElementById('compose-subject').value;
    console.log(rec);
    var txt = document.getElementById('compose-body').value;
    fetch('/emails',{
      method : 'POST',
      body : JSON.stringify({
        recipients: rec,
        subject : sub,
        body : txt      

      })
    }).then(response => response.json()).then(report =>{ console.log(report);
        document.querySelector('#compose-view').style.display = 'none';
        document.getElementById('emails-view').innerHTML='<h3>'+report.json()+'</h3>';
      });
    
    
  }




}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-box').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
if (mailbox == 'sent')
{
  fetch('emails/sent').then(response => response.json()).then(emails => {console.log(emails);
    emails.forEach(appendFunc);
    function appendFunc(value,index,array){
    var elem = document.createElement('div');
    var sp = document.createElement('div');
   
    sp.innerHTML = '<br>';
    // document.getElementById('emails-view').innerHTML='<b> '+emails[0]['sender']+'<b>   '+emails[0]['subject'];
    elem.innerHTML='<b> '+array[index]['sender']+'<b> &nbsp &nbsp'+array[index]['subject']+ '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp '+ array[index]['timestamp'].slice(0,19);
    
    elem.style.width= '80%';
    // elem.style.float= 'left';
    elem.style.border = 'double';
    elem.style.borderColor = 'blue'; 
    elem.style.paddingTop = '10px';
    elem.style.paddingBottom = '10px';
    elem.style.textAlign = 'center';
    elem.style.cursor = 'pointer';
    elem.style.borderRadius = '15px';
    elem.addEventListener('click',() => loadMail(array[index]['id']));
    document.getElementById('emails-view').append(elem);
    document.getElementById('emails-view').append(sp);
    }
  });
}
else if (mailbox == 'archive')
{
  fetch('emails/archive').then(response => response.json()).then(emails => {console.log(emails);
    emails.forEach(appendFunc);
    function appendFunc(value,index,array){
    var elem = document.createElement('div');
    var sp = document.createElement('div');
    sp.innerHTML = '<br>';
    // document.getElementById('emails-view').innerHTML='<b> '+emails[0]['sender']+'<b>   '+emails[0]['subject'];
    elem.innerHTML='<b> '+array[index]['sender']+'<b> &nbsp &nbsp'+array[index]['subject']+ '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  '+ array[index]['timestamp'].slice(0,19);
    elem.style.width= '80%';

    elem.style.border = 'double';
    elem.style.borderColor = 'blue';
    elem.style.paddingTop = '10px';
    elem.style.paddingBottom = '10px';
    elem.style.textAlign = 'center';
    elem.style.cursor = 'pointer';
    elem.style.borderRadius = '15px';
    elem.addEventListener('click',() => loadMail(array[index]['id'])); 
    
    document.getElementById('emails-view').append(elem);

    document.getElementById('emails-view').append(sp);}});
}
else
{
  fetch('emails/inbox').then(response => response.json()).then(emails => { console.log(emails);
    emails.forEach(appendFunc);
    function appendFunc(value,index,array){
    var elem = document.createElement('div');
    var sp = document.createElement('div');
    sp.innerHTML = '<br>';
    // document.getElementById('emails-view').innerHTML='<b> '+emails[0]['sender']+'<b>   '+emails[0]['subject'];
    elem.innerHTML='<b> '+array[index]['sender']+'<b> &nbsp &nbsp'+array[index]['subject']+ '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  '+ array[index]['timestamp'].slice(0,19);
    elem.style.width= '80%';

    elem.style.border = 'double';
    elem.style.borderColor = 'blue';
    elem.style.paddingTop = '10px';
    elem.style.paddingBottom = '10px';
    elem.style.textAlign = 'center';
    elem.style.cursor = 'pointer';
    elem.style.borderRadius = '15px';
    elem.addEventListener('click',() => loadMail(array[index]['id'])); 
    
    document.getElementById('emails-view').append(elem);

    document.getElementById('emails-view').append(sp);
    };
    // emails.forEach(function(value,index,array){document.querySelector('#archive').addEventListener('click',function(){fetch('emails/'+array[index]['id'],{method:'PUT',body: JSON.stringify({archived: true})});})});
  });
}
function loadMail(emailId){
  fetch('emails/'+emailId).then(response => response.json()).then(emails => { console.log(emails);
    var boxElem = document.getElementById('emails-box');
    boxElem.style.display = 'block';
    boxElem.style.paddingLeft = '10px';
    boxElem.style.border = 'double';
    boxElem.style.borderRadius = '10px';
    boxElem.style.borderColor = 'blue';
    boxElem.style.paddingTop = '20px';
    boxElem.style.paddingBottom = '20px';
    document.getElementById('emails-view').style.display = 'block';
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    if (mailbox == 'inbox')
    { if (emails['body'].includes('Reply Text Here:')){
      var prevCont = emails['body'].split('Reply Text Here:')[0];
      boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp';
      
      var formatCont = prevCont.split('On');
      formatCont.forEach(function(value,index,array){
        if (index!= 0){
        boxElem.innerHTML = boxElem.innerHTML + '<p> On '+array[index]+'</p>'; 
      }});
      var lastCont = emails['body'].split('Reply Text Here:')[1];
      boxElem.innerHTML = boxElem.innerHTML+ '<p> Reply Text Here: <br>' + lastCont;
      // boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
      // +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
      // +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp <p> &nbsp &nbsp'+prevCont+'</p><p>Reply Text Here: <br>'+lastCont+'</p>';
    }
    else{
      boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp <p> &nbsp &nbsp'+emails['body']+'</p>';
    }  
      document.getElementById('archive').addEventListener('click',function(){fetch('emails/'+emailId,{method:'PUT',body: JSON.stringify({archived: true})});});
      fetch('emails/'+emailId,{method:'PUT',body: JSON.stringify({read: true})});
      var repElem = document.createElement('div');
      repElem.innerHTML = '<br><button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>';
      boxElem.append(repElem);
      repElem.addEventListener('click',function(){
        
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-box').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = emails['sender'];
  if (emails['subject'].includes('Re: ')){document.querySelector('#compose-subject').value = emails['subject'];
  var textMatter = emails['body'].split('Reply Text Here:');
  document.querySelector('#compose-body').value = textMatter[0]+` On `+emails['timestamp'].slice(0,19)+' '+emails['sender']+ ` replied: `+textMatter[1]+`\n Reply Text Here: \n`;
}
  else{document.querySelector('#compose-subject').value = 'Re: '+ emails['subject'];
  var header = 'On ' +emails['timestamp'].slice(0,19)+' '+emails['sender']+ ' wrote: '+emails['body']+`\n Reply Text Here:\n`;
  document.querySelector('#compose-body').value = header+'\n';
}
  
  var formElem = document.getElementById('compose-form');
  if (formElem)
  {
    formElem.addEventListener('submit',sendMail);
  }

  function sendMail()
  {
    var rec = document.getElementById('compose-recipients').value;
    var sub = document.getElementById('compose-subject').value;
    console.log(rec);
    var txt = document.getElementById('compose-body').value;
    fetch('/emails',{
      method : 'POST',
      body : JSON.stringify({
        recipients: rec,
        subject : sub,
        body : txt      

      })
    }).then(response => response.json()).then(report =>{ console.log(report);
        document.querySelector('#compose-view').style.display = 'none';
        document.getElementById('emails-view').innerHTML='<h3>'+response.json()+'</h3>';
      });
    
    
  }




}
        
        
        
        );
    }
    else if (mailbox=='sent'){
      if (emails['body'].includes('Reply Text Here:')){
        var prevCont = emails['body'].split('Reply Text Here:')[0];
        boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
        +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
        +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp';
        
        var formatCont = prevCont.split('On');
        formatCont.forEach(function(value,index,array){
          if (index!= 0){
          boxElem.innerHTML = boxElem.innerHTML + '<p> On '+array[index]+'</p>'; 
        }});
        var lastCont = emails['body'].split('Reply Text Here:')[1];
        boxElem.innerHTML = boxElem.innerHTML+ '<p> Reply Text Here: <br>' + lastCont;
        // boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
        // +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
        // +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp <p> &nbsp &nbsp'+prevCont+'</p><p>Reply Text Here: <br>'+lastCont+'</p>';
      }
      else{
        boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="archive">Archive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
        +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
        +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp <p> &nbsp &nbsp'+emails['body']+'</p>';
      }  
    }
    else{
      boxElem.innerHTML='<button class="btn btn-sm btn-outline-primary" id="unarchive">Unarchive</button>'+'<li style="border-bottom:'+"'solid'"+'"><b>Sender:</b> &nbsp &nbsp'+emails['sender']+'</li>'+'<li style="border-bottom:'+"'solid'"+'"><b>Recipients:</b> &nbsp &nbsp'+emails['recipients']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Subject:</b> &nbsp &nbsp'+emails['subject']+'</li>'
      +'<li style="border-bottom:'+"'solid'"+'"><b>Timestamp:</b> &nbsp &nbsp'+emails['timestamp']+'</li>'+'<br><b>Body:</b>&nbsp &nbsp <p> &nbsp &nbsp'+emails['body']+'</p>';  
      document.getElementById('unarchive').addEventListener('click',function(){fetch('emails/'+emailId,{method:'PUT',body: JSON.stringify({archived: false})});});

    }
  }
  );

  

}
}

// var formElem = document.getElementById('compose-form');
// if (formElem){
//   formElem.addEventListener('submit',sendMail);
// }

// function sendMail()
// {
//   var rec = document.querySelector('#compose-recipients').value;
//   var sub = document.querySelector('#compose-subject').value;
//   console.log(rec);
//   var txt = document.querySelector('#compose-body').value;
//   var resp = fetch('/emails',{
//     method : 'POST',
//     body : JSON.stringify({
//       recipients: rec,
//       subject : sub,
//       body : txt      

//     })
//   }).then(response => response.json()).then(report =>{ console.log(report);});
  
//   if (resp.ok)
//   {
//     document.getElementById('emails-view').innerHTML='<h3>Mail Sent Successfully. </h3><br>'+resp.json();
//   }
//   else
//   {
//     document.getElementById('emails-view').innerHTML= resp.json();
//   }
// }
