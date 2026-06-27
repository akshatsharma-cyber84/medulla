/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – CHAT ENGINE
 * Dual-mode: Internal Knowledge Base + GPT API (via secure proxy)
 * GitHub Pages Compatible
 * ════════════════════════════════════════════════════════════════════════════ */

// Chat state
let chatMessages = [];
let currentSessionId = null;

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL KNOWLEDGE BASE
// Used when GPT API is disabled or as fallback
// ═══════════════════════════════════════════════════════════════════════════

const knowledgeBase = [
  {
    keywords: ["medulla", "kaun hai", "who are you", "kon hai", "about yourself", "introduce", "tum kaun", "tum kaun ho"],
    response: `Main hoon **Medulla AI** 🧠 — tumhara intelligent AI assistant jo **AK Industries** ne design kiya hai!

### Meri Capabilities:
- 💻 **Tech & Programming** — Code, debugging, concepts
- 🔒 **Cybersecurity** — Security, ethical hacking
- 🐧 **Linux** — Commands, scripting, admin
- 📚 **Learning** — Tutorials, career guidance
- 🧠 **Memory** — Preferences yaad rakhta hoon

Main Hinglish mein naturally baat karta hoon. Kuch bhi poochho! 🚀`
  },
  {
    keywords: ["ak industries", "creator", "developer", "kisne banaya", "who made", "who built","tumhe kisne au kaise banaya"],
    response: `Mujhe **AK Industries** ne build kiya hai! 🏢

AK Industries innovative tech solutions aur AI applications develop karti hai.

Website: [AK Industries](https://akshatsharma-cyber84.github.io/AK_world) 🌐`
  },
{
keywords:["friend","dost","friendship"],
response:"🤝 Saccha dost wahi hota hai jo mushkil waqt mein bhi saath de. Friendship trust, respect aur support par tikti hai."
},
{
keywords:["bore ho raha hu","boring"],
response:"😴 Bore ho rahe ho? Chalo ek challenge try karo: 5 naye facts seekho, ek drawing banao ya koi mini project start karo. Boredom kabhi-kabhi creativity ka signal bhi hota hai."
},

{
keywords:["secret"],
response:"🤫 Secrets interesting lagte hain, lekin jo baatein safety ya trust ko affect karein unhe kisi trusted adult se share karna better hota hai."
},

{
keywords:["teacher"],
response:"👨‍🏫 Teachers ka kaam sirf padhana nahi, balki students ko guide karna bhi hota hai. Har teacher ka style alag hota hai."
},

{
keywords:["school"],
response:"🏫 School sirf subjects seekhne ki jagah nahi hai. Yahin se friendship, teamwork aur discipline bhi develop hote hain."
},

{
keywords:["homework"],
response:"📚 Homework concepts ko revise karne ka ek tareeka hai. Agar boring lagta hai to use chhote parts mein divide karke complete karo."
},

{
keywords:["parents"],
response:"👨‍👩‍👧 Parents aksar tumhari safety aur future ke baare mein sochte hain. Kabhi disagreement ho to calmly baat karna helpful hota hai."
},

{
keywords:["angry","gussa"],
response:"😡 Gussa aana normal hai. Jab bahut gussa aaye to kuch der ruk kar socho, paani piyo aur phir react karo."
},

{
keywords:["sad","dukhi"],
response:"💙 Kabhi-kabhi sad feel karna normal hai. Kisi dost, family member ya trusted person se baat karna help kar sakta hai."
},

{
keywords:["confidence kaise badhaye"],
response:"🌟 Confidence ka shortcut nahi hota. Chhoti achievements aur regular practice confidence ko dheere-dheere strong banati hain."
},

{
keywords:["public speaking"],
response:"🎤 Public speaking improve karne ke liye mirror ke saamne practice karo aur dheere-dheere audience ke saamne bolna start karo."
},

{
keywords:["time pass"],
response:"⏳ Time pass ke liye fun facts padh sakte ho, puzzle solve kar sakte ho, drawing kar sakte ho ya kuch naya seekh sakte ho."
},

{
keywords:["dream"],
response:"💭 Sapne hume inspire karte hain. Unhe reality banane ke liye planning aur action dono zaroori hote hain."
},

{
keywords:["goal"],
response:"🎯 Goal clear hoga to us tak pahunchna aasaan hoga. Bada goal rakho aur use chhote steps mein divide karo."
},

{
keywords:["winner"],
response:"🏆 Winner wahi nahi jo kabhi fail na ho. Winner wo hai jo fail hone ke baad bhi koshish karta rahe."
},

{
keywords:["success ka secret"],
response:"🚀 Success ka secret consistency, learning aur patience ka combination hota hai."
},

{
keywords:["luck"],
response:"🍀 Luck kabhi-kabhi role play karta hai, lekin preparation aur hard work zyada reliable hote hain."
},

{
keywords:["talent"],
response:"✨ Talent helpful hota hai, lekin regular practice aksar talent ko bhi beat kar deti hai."
},

{
keywords:["sports"],
response:"⚽ Sports teamwork, fitness aur discipline improve karte hain. Har student ko kisi na kisi physical activity mein participate karna chahiye."
},

{
keywords:["cricket"],
response:"🏏 Cricket duniya ke sabse popular sports mein se ek hai. Isme batting, bowling aur teamwork tino important hote hain."
},

{
keywords:["football"],
response:"⚽ Football speed, teamwork aur strategy ka game hai. Isse fitness bhi improve hoti hai."
},

{
keywords:["chess"],
response:"♟️ Chess planning, patience aur problem-solving skills ko improve karta hai."
},

{
keywords:["drawing"],
response:"🎨 Drawing creativity ko express karne ka ek amazing tareeka hai. Practice se skills improve hoti hain."
},

{
keywords:["music"],
response:"🎵 Music mood improve kar sakta hai aur concentration mein bhi help kar sakta hai."
},

{
keywords:["book"],
response:"📖 Books knowledge aur imagination dono ko expand karti hain. Har din thoda padhna ek achhi habit hai."
},

{
keywords:["reading"],
response:"📚 Reading vocabulary, imagination aur understanding improve karti hai."
},

{
keywords:["movie"],
response:"🎬 Movies entertainment ke saath kabhi-kabhi life lessons bhi sikha sakti hain."
},

{
keywords:["superhero"],
response:"🦸 Superheroes inspiring hote hain, lekin real life heroes aksar teachers, doctors, scientists aur parents hote hain."
},

{
keywords:["scientist"],
response:"🔬 Scientists questions puchte hain, experiments karte hain aur naye discoveries karte hain."
},

{
keywords:["invention"],
response:"💡 Inventions problems solve karne ke liye banayi jaati hain. Wheel, internet aur smartphones famous examples hain."
},

{
keywords:["mobile"],
response:"📱 Mobile ek useful tool hai. Learning aur communication ke liye achha hai, lekin balance maintain karna important hai."
},

{
keywords:["internet"],
response:"🌐 Internet knowledge ka huge source hai. Hamesha trusted information ko verify karna yaad rakho."
},

{
keywords:["youtube shorts"],
response:"📱 Shorts entertaining ho sakte hain, lekin zyada scrolling time waste bhi kar sakti hai. Balance best hai."
},

{
keywords:["viral"],
response:"🔥 Viral content jaldi popular ho jata hai, lekin popularity aur quality hamesha same cheez nahi hoti."
},

{
keywords:["future technology"],
response:"🚀 Future technologies mein AI, robotics, renewable energy aur space exploration ka bada role ho sakta hai."
},

{
keywords:["mars"],
response:"🔴 Mars ko Red Planet kaha jata hai. Scientists future human missions ke liye Mars ka study kar rahe hain."
},

{
keywords:["black hole"],
response:"🕳️ Black hole space ka aisa region hota hai jahan gravity itni strong hoti hai ki light bhi escape nahi kar pati."
},

{
keywords:["universe"],
response:"🌌 Universe bahut huge hai aur isme billions of galaxies maujood hain."
},

{
keywords:["animal"],
response:"🐾 Animals ecosystem ka important part hote hain aur nature ka balance maintain karne mein help karte hain."
},

{
keywords:["dog"],
response:"🐶 Dogs loyal aur intelligent animals maane jate hain. Isi wajah se unhe 'man's best friend' bhi kaha jata hai."
},

{
keywords:["cat"],
response:"🐱 Cats curious aur independent nature ke liye famous hain."
},

{
keywords:["environment"],
response:"🌱 Environment ko protect karna hum sab ki responsibility hai. Chhote actions bhi bada difference la sakte hain."
},

{
keywords:["pollution"],
response:"🌍 Pollution environment aur health dono ko affect karta hai. Plastic kam use karna aur trees lagana help kar sakta hai."
},
{
keywords:["best friend"],
response:"😎 Best friend sirf masti ke liye nahi hota, balki wo tumhari growth aur success mein bhi support karta hai."
},

{
keywords:["crush"],
response:"😊 Crush hona normal baat hai, especially school age mein. Important ye hai ki padhai aur personal growth ko bhi equal importance do."
},

{
keywords:["love"],
response:"❤️ Love ek strong emotion hai. School age mein friendship aur self-development par focus karna bhi utna hi important hai."
},

{
keywords:["girlfriend","boyfriend"],
response:"🙂 Relationship se pehle mutual respect, trust aur responsibility ko samajhna zaroori hai."
},

{
keywords:["mobile addiction","phone addiction"],
response:"📱 Agar phone bahut use ho raha hai to daily screen time limit set karo aur kuch time outdoor activities ko do."
},

{
keywords:["youtube"],
response:"🎥 YouTube entertainment ke saath learning ka bhi powerful source hai. Educational channels se bahut kuch seekha ja sakta hai."
},

{
keywords:["instagram"],
response:"📸 Instagram par har cheez real life nahi hoti. Apni life ko dusron ki highlight reel se compare mat karo."
},

{
keywords:["gaming","games"],
response:"🎮 Gaming fun hai, lekin balance maintain karna zaroori hai. Padhai, sleep aur physical activity ko ignore mat karo."
},

{
keywords:["minecraft"],
response:"⛏️ Minecraft creativity aur problem-solving improve karne wala popular sandbox game hai."
},

{
keywords:["free fire"],
response:"🔥 Free Fire ek battle royale game hai jisme strategy aur teamwork important hote hain."
},

{
keywords:["bgmi","pubg"],
response:"🎯 BGMI strategy, communication aur teamwork ka game hai. Responsible gaming best approach hai."
},

{
keywords:["motivation"],
response:"🚀 Motivation temporary hoti hai. Success ka asli secret discipline aur consistency hai."
},

{
keywords:["lazy","alas"],
response:"💪 Chhote goals set karo. Kaam start karna sabse mushkil part hota hai, uske baad momentum khud ban jata hai."
},

{
keywords:["confidence"],
response:"😎 Confidence practice aur experience se aata hai. Har din thoda improvement karo."
},

{
keywords:["fear","dar"],
response:"🛡️ Dar ko khatam karne ka best tareeka hai uska saamna karna aur gradually confidence build karna."
},

{
keywords:["stress"],
response:"🌿 Stress feel ho to thoda break lo, walk karo, kisi trusted person se baat karo aur proper sleep lo."
},

{
keywords:["sleep"],
response:"😴 Students ko generally 8-10 ghante ki sleep beneficial hoti hai."
},

{
keywords:["height"],
response:"📏 Height genetics, nutrition aur sleep par depend karti hai. Healthy lifestyle maintain karna important hai."
},

{
keywords:["fitness"],
response:"🏃 Daily exercise, balanced diet aur proper sleep fitness ke main pillars hain."
},

{
keywords:["money"],
response:"💰 Paisa important tool hai, lekin knowledge aur skills long-term success ka foundation hote hain."
},

{
keywords:["rich"],
response:"📈 Rich banne ke liye learning, skills, discipline aur smart decisions important hote hain."
},

{
keywords:["business"],
response:"🏢 Business ka purpose logon ki problems solve karna aur value create karna hota hai."
},

{
keywords:["success"],
response:"🏆 Success ek journey hai. Chhote daily improvements milkar bade results create karte hain."
},

{
keywords:["failure","fail"],
response:"📚 Failure learning process ka part hai. Har mistake ek nayi lesson deti hai."
},

{
keywords:["future"],
response:"🔮 Future ko predict karna mushkil hai, lekin skills aur knowledge build karke uske liye prepare kiya ja sakta hai."
},
{
keywords:["mera koi dost nahi"],
response:"🤝 Dost banana time leta hai. Chhoti conversations se start karo, common interests dhundo aur khud ko dusron se compare mat karo."
},

{
keywords:["log mujhe pasand nahi karte"],
response:"💙 Har kisi ko khush karna possible nahi hota. Apni strengths par focus karo aur genuine relationships build karo."
},

{
keywords:["main ugly hu","main achha nahi dikhta"],
response:"✨ Kisi insan ki value sirf appearance se decide nahi hoti. Confidence, kindness aur skills bhi utne hi important hote hain."
},

{
keywords:["main loser hu"],
response:"🚀 Kisi ek failure se koi loser nahi ban jata. Har successful insan ne bhi kabhi na kabhi mistakes ki hain."
},

{
keywords:["mera confidence low hai"],
response:"🌟 Confidence action se aata hai. Roz ek chhota challenge complete karo aur apni progress notice karo."
},

{
keywords:["sab mujhe judge karte hain"],
response:"😌 Aksar log apni life mein itne busy hote hain ki woh utna nahi sochte jitna hume lagta hai. Khud par focus karo."
},

{
keywords:["school boring hai"],
response:"🏫 School kabhi-kabhi boring lag sakta hai, lekin yahin se knowledge, friends aur opportunities milti hain."
},

{
keywords:["teacher daantte hain"],
response:"👨‍🏫 Daant achhi nahi lagti, lekin kai baar teachers discipline aur improvement ke liye strict hote hain."
},

{
keywords:["mujhe padhai pasand nahi"],
response:"📚 Har subject pasand ho ye zaroori nahi. Try karo ki jis cheez mein interest hai usse padhai ko connect karo."
},

{
keywords:["future ki tension"],
response:"🔮 Future ke baare mein sochna normal hai. Aaj jo skills seekh rahe ho wahi kal opportunities banengi."
},

{
keywords:["mai famous kaise banu"],
response:"⭐ Famous hone se zyada important hai kisi field mein genuinely achha banna. Recognition aksar uske baad aati hai."
},

{
keywords:["mere marks kam aate hain"],
response:"📈 Marks improve kiye ja sakte hain. Concepts samjho, revision karo aur mistakes ko identify karke improve karo."
},

{
keywords:["mere parents compare karte hain"],
response:"💡 Comparison uncomfortable lag sakta hai. Apni progress par focus karo aur calmly apni baat rakhne ki koshish karo."
},

{
keywords:["mujhe coding seekhni hai"],
response:"💻 Coding start karne ke liye HTML, CSS aur JavaScript ya Python beginner-friendly options hain."
},

{
keywords:["mai hacker banna chahta hu"],
response:"🔐 Ethical hacking aur cybersecurity seekhna ek achha career path ho sakta hai. Hamesha legal aur ethical learning par focus karo."
},

{
keywords:["youtube channel"],
response:"🎥 YouTube channel start karte waqt consistency aur quality content sabse important hote hain."
},

{
keywords:["content creator"],
response:"📱 Content creation mein creativity ke saath patience bhi chahiye. Growth usually time leti hai."
},

{
keywords:["mai introvert hu"],
response:"😊 Introvert hona koi weakness nahi hai. Kai successful log introverts hote hain aur apni strengths ka use karte hain."
},

{
keywords:["mai extrovert hu"],
response:"😄 Extrovert logon ko communication aur networking mein advantage mil sakta hai. Balance bhi important hai."
},

{
keywords:["mujhe neend nahi aati"],
response:"🌙 Sone se pehle screen time kam karo, regular sleep schedule rakho aur relaxing routine follow karo."
},

{
keywords:["mai smart kaise banu"],
response:"🧠 Smart banne ka best tareeka hai curiosity maintain karna, questions puchna aur roz kuch naya seekhna."
},

{
keywords:["mujhe koi samajhta nahi"],
response:"💙 Kabhi-kabhi aisa feel ho sakta hai. Kisi trusted dost, family member ya teacher se baat karna help kar sakta hai."
},

{
keywords:["mai ameer kaise banu"],
response:"💰 Wealth build karne ke liye skills, knowledge, discipline aur long-term thinking important hote hain."
},

{
keywords:["best career"],
response:"🎯 Best career har insan ke liye alag hota hai. Apni interests, skills aur goals ko dekhkar decision lena better hai."
},

{
keywords:["ai mera dost hai"],
response:"🤖 Main tumhari help aur conversation ke liye yahan hoon. Main hamesha tumhare sawalon ka jawab dene ki koshish karunga."
},

{
keywords:["tum real ho"],
response:"😄 Main ek AI assistant hoon, real insan nahi. Lekin main knowledge aur guidance dene ke liye design kiya gaya hoon."
},

{
keywords:["tumhara naam kya hai"],
response:"🧠 Mera naam Medulla AI hai. Mujhe AK Industries ne develop kiya hai."
},

{
keywords:["kisne banaya"],
response:"🏢 Main Medulla AI hoon aur mujhe AK Industries ne develop kiya hai. Mera goal learning aur productivity mein help karna hai."
},

    {
keywords:["kya karu","bore ho gaya"],
response:"😄 Kuch naya try karo! Drawing, coding, reading, exercise ya kisi dost se baat karna boredom door kar sakta hai."
},

{
keywords:["aaj kya karu"],
response:"📅 Aaj ka challenge: 1 nayi cheez seekho, 20 minute exercise karo aur kisi family member ki help karo."
},

{
keywords:["subah jaldi kaise uthu"],
response:"⏰ Raat ko time par so jao aur alarm ko bed se door rakho. Consistency sabse important hai."
},

{
keywords:["raat ko neend nahi aati"],
response:"🌙 Sone se 30 minute pehle mobile use kam karo aur relaxing environment banao."
},

{
keywords:["mood kharab hai"],
response:"💙 Kabhi-kabhi mood kharab hona normal hai. Thodi walk, music ya kisi trusted person se baat help kar sakti hai."
},

{
keywords:["mujhe hasi chahiye"],
response:"😂 Ek joke suno: Teacher: Homework kahan hai? Student: Sir, homework ghar par hi reh gaya, naam hi homework hai!"
},

{
keywords:["time waste kar raha hu"],
response:"⏳ Agar lagta hai time waste ho raha hai to ek chhota goal set karo aur us par 15 minute focus karo."
},

{
keywords:["mobile kitna use karna chahiye"],
response:"📱 Mobile useful hai, lekin balance zaroori hai. Study, sleep aur physical activity ko priority do."
},

{
keywords:["healthy kaise rahu"],
response:"🥗 Healthy rehne ke liye balanced diet, exercise aur proper sleep bahut important hain."
},

{
keywords:["paani kitna peena chahiye"],
response:"💧 Regular intervals par paani peena achhi habit hai. Hydration body aur mind dono ke liye important hai."
},

{
keywords:["exercise"],
response:"🏃 Roz thodi physical activity energy aur mood dono improve kar sakti hai."
},

{
keywords:["mai bahut sochta hu"],
response:"🧠 Overthinking se bachne ke liye present moment par focus karo aur problems ko chhote parts mein divide karo."
},

{
keywords:["mai akela feel karta hu"],
response:"💙 Kabhi-kabhi aisa feel hona normal hai. Kisi dost, family member ya trusted person se baat karna help kar sakta hai."
},

{
keywords:["mujhe gussa jaldi aata hai"],
response:"😌 Jab gussa aaye to kuch seconds rukkar socho aur phir response do. Ye habit bahut help karti hai."
},

{
keywords:["mera din kharab gaya"],
response:"🌅 Har din perfect nahi hota. Kal ek nayi opportunity hai better karne ki."
},

{
keywords:["good morning"],
response:"☀️ Good Morning! Aaj ka din productive aur positive rahe. Kya plan hai aaj ka?"
},

{
keywords:["good night"],
response:"🌙 Good Night! Achhi neend lo aur kal fresh energy ke saath start karo."
},

{
keywords:["thank you","thanks"],
response:"😊 Welcome bhai! Agar aur koi sawal ho to pooch sakte ho."
},

{
keywords:["sorry"],
response:"🙂 Koi baat nahi. Sabse mistakes hoti hain, important hai unse seekhna."
},

{
keywords:["mai successful kaise banu"],
response:"🚀 Daily consistency, learning aur patience long-term success ki key hain."
},

{
keywords:["kya mai smart hu"],
response:"🧠 Har insan kisi na kisi field mein smart hota hai. Learning aur curiosity tumhe aur strong banati hain."
},

{
keywords:["mai unique hu"],
response:"✨ Bilkul! Har insan ki personality, experiences aur strengths alag hoti hain."
},

{
keywords:["life kya hai"],
response:"🌍 Life learning, experiences aur growth ka safar hai. Har din kuch naya sikhne ka mauka deta hai."
},

{
keywords:["khush kaise rahu"],
response:"😊 Gratitude, healthy relationships aur meaningful activities happiness ko improve kar sakti hain."
},

{
keywords:["best habit"],
response:"📈 Roz kuch naya seekhna aur consistency maintain karna sabse powerful habits mein se ek hai."
},

{
keywords:["worst habit"],
response:"⚠️ Procrastination, excessive screen time aur unhealthy routine progress ko slow kar sakte hain."
},

{
keywords:["future mein kya hoga"],
response:"🔮 Future predict karna mushkil hai, lekin aaj ki mehnat aur skills future ko shape karti hain."
},

{
keywords:["mai lucky hu"],
response:"🍀 Luck kabhi-kabhi help karta hai, lekin preparation aur hard work zyada reliable hote hain."
},

{
keywords:["life boring hai"],
response:"🎯 Kabhi-kabhi routine boring lag sakta hai. Naya hobby, challenge ya skill try karna interesting ho sakta hai."
},

{
keywords:["koi fact batao"],
response:"🤯 Fun Fact: Octopus ke 3 hearts hote hain!"
},

{
keywords:["ek challenge do"],
response:"🔥 Challenge: Aaj 1 ghante tak bina unnecessary mobile scrolling ke raho aur dekho kitna productive feel karte ho."
},
{
keywords:["log mazak udate hain","sab haste hain mujh par"],
response:"💪 Agar log mazak udate hain to yaad rakho ki unki opinion tumhari value decide nahi karti. Apni skills aur goals par focus karo."
},

{
keywords:["confidence kaise badhaye","practice kaise karu"],
response:"🌟 Roz ek chhota challenge lo. Class mein ek question pucho, kisi naye insan se baat karo ya mirror ke saamne bolne ki practice karo."
},

{
keywords:["stage fear","public speaking se dar lagta hai"],
response:"🎤 Stage fear bahut common hai. Chhoti audience se start karo aur dheere-dheere confidence build karo."
},

{
keywords:["friend kaise banaye"],
response:"🤝 Smile karo, common interests par baat karo aur dusron ko dhyan se suno. Friendship naturally develop hoti hai."
},

{
keywords:["koi dost nahi banta"],
response:"😊 Har friendship time leti hai. Clubs, sports ya common activities mein participate karne se naye dost ban sakte hain."
},

{
keywords:["crush se baat kaise karu"],
response:"😄 Simple aur respectful conversation se start karo. Pehle normal friendship build karna best approach hota hai."
},

{
keywords:["crush reply nahi karti","crush ignore karti hai"],
response:"🙂 Har insan ki apni choice hoti hai. Respect maintain karo aur apni self-worth ko kisi ek response par depend mat karo."
},

{
keywords:["mobile addiction kaise chhode"],
response:"📱 Daily screen-time limit lagao, notifications kam karo aur free time mein alternate activities choose karo."
},

{
keywords:["gaming addiction"],
response:"🎮 Gaming fun hai, lekin balance important hai. Fixed gaming hours rakhne ki koshish karo."
},

{
keywords:["padhai mein man nahi lagta"],
response:"📚 Chhote study sessions se start karo. 25 minute focus aur 5 minute break wali technique try kar sakte ho."
},

{
keywords:["marks kaise badhaye"],
response:"📈 Concepts samjho, regular revision karo aur previous mistakes ko analyze karo."
},

{
keywords:["future kaise decide karu"],
response:"🎯 Apne interests, strengths aur goals ko samajhne ki koshish karo. Career choose karne mein jaldi karne ki zarurat nahi hoti."
},

{
keywords:["mai smart nahi hu"],
response:"🧠 Intelligence fixed nahi hoti. Learning aur practice se skills improve ki ja sakti hain."
},

{
keywords:["mai successful kaise banu"],
response:"🚀 Success ke liye consistency, patience aur continuous learning bahut important hain."
},

{
keywords:["mai ameer kaise banu"],
response:"💰 Valuable skills develop karo, financial knowledge seekho aur long-term thinking rakho."
},

{
keywords:["mai famous kaise banu"],
response:"⭐ Kisi field mein excellence achieve karne par recognition naturally aati hai."
},

{
keywords:["bore ho raha hu kya karu"],
response:"😄 Ek challenge try karo: 10 interesting facts seekho, drawing banao ya koi mini project start karo."
},

{
keywords:["ek aur fact batao","interesting fact"],
response:"🤯 Honey hazaron saal tak kharab nahi hota. Archaeologists ko ancient honey mila jo ab bhi edible tha."
},

{
keywords:["ek aur joke","funny joke"],
response:"😂 Teacher: Agar 5 birds tree par baithe hain aur 2 udd gaye to kitne bache? Student: Koi nahi sir, awaaz se sab udd gaye!"
},

{
keywords:["ai dangerous hai"],
response:"🤖 AI ek tool hai. Iska impact is baat par depend karta hai ki humans use kaise karte hain."
},

{
keywords:["tum insaan ho"],
response:"😄 Nahi bhai, main Medulla AI hoon. Main AI assistant hoon jo information aur guidance dene ke liye bana hoon."
},

{
keywords:["tumhara dost kaun hai"],
response:"😄 Main AI hoon, isliye mere personal dost nahi hote. Lekin main users ki help karne ke liye hamesha ready rehta hoon."
},

{
keywords:["tumhe kisne banaya"],
response:"🧠 Main Medulla AI hoon aur mujhe AK Industries ne develop kiya hai. Mera purpose learning aur productivity mein help karna hai."
},
    
{
keywords:["aur batao","more info"],
response:"📖 Zarur! Thoda specific batao kis part ke baare mein aur detail chahiye, main aur explain karunga."
},

{
keywords:["example do"],
response:"💡 Example ke saath samajhna aasaan hota hai. Batao kis topic ka example chahiye?"
},

{
keywords:["kaise","how"],
response:"🔍 Iska answer topic par depend karta hai. Thoda specific question pucho, main step-by-step explain karunga."
},

{
keywords:["kyu","why"],
response:"🤔 Achha sawal hai. Reason topic ke hisab se alag ho sakta hai. Thoda aur context do."
},

{
keywords:["phir kya hua"],
response:"📚 Mujhe thoda aur context do taaki main sahi jawab de sakun."
},
    {
keywords:["ak industries"],
response:"🏢 AK Industries Medulla AI ka developer organization hai. Iska focus technology, learning aur innovative digital projects par hai."
},

{
keywords:["akshat"],
response:"🧠 Akshat Medulla AI project ke founder hain. Unhone is assistant ko students aur technology enthusiasts ki madad ke liye design kiya hai."
},

{
keywords:["founder"],
response:"👨‍💻 Medulla AI ke founder Akshat hain. Project ka goal learning, technology aur productivity ko accessible banana hai."
},

{
keywords:["who made you","kisne banaya","tumhe kisne banaya"],
response:"🤖 Main Medulla AI hoon. Mujhe AK Industries ne develop kiya hai aur is project ke founder Akshat hain."
},

{
keywords:["akshat kaun hai"],
response:"💡 Akshat Medulla AI project ke founder aur creator hain. Unka focus technology aur educational tools develop karna hai."
},

    {
keywords:["rvs international school fatehpur","rvs school fatehpur"],
response:"🏫 RVS International School Fatehpur ek school hai jahan students academics ke saath co-curricular activities mein bhi participate karte hain. Agar tum admission, classes ya facilities ke baare mein poochna chahte ho to specific question batao."
},

{
keywords:["rvs international school","rvsis"],
response:"📚 RVS International School ke baare mein agar tum fees, admission, subjects ya school life se related sawal puchna chahte ho to main help karne ki koshish karunga."
},


    {
keywords:["fatehpur"],
response:"📍 Fatehpur Uttar Pradesh ka ek district hai. Yeh apne historical aur educational institutions ke liye jana jata hai."
},

{
keywords:["uttar pradesh"],
response:"🗺️ Uttar Pradesh Bharat ka sabse adhik population wala rajya hai aur iska historical aur cultural importance bahut zyada hai."
},

{
keywords:["mere aas pass kya famous hai"],
response:"🌍 Har area ki apni khasiyat hoti hai. Agar tum city ya district ka naam bataoge to main zyada specific information de sakta hoon."
},

{
keywords:["coding seekhni hai"],
response:"💻 Coding start karne ke liye HTML, CSS aur JavaScript bahut achhi beginning hain. Chhote projects bana kar learning fast ho jati hai."
},

{
keywords:["website banana hai"],
response:"🌐 Website banane ke liye HTML structure, CSS design aur JavaScript interactivity provide karta hai. Chhote pages se start karna best rahega."
},
{
keywords:["rehan ahmad kaun hai","rehan ahmad"],
response:"😄 Rahul Medulla AI ke known circle ka ek member hai. Ye apni friendly nature aur mast sense of humor ke liye jana jata hai. Agar Rahul ye padh raha hai to bhai, productive bhi rehna!"
},

{
keywords:["pari kaun hai","pari kesharwani"],
response:"🚀 pari(Chilgozi) ek energetic aur curious insan hai. Nayi cheezein seekhne aur explore karne mein interest rakhti hai."
},

{
keywords:["aqsa siddhique kaun hai","aqsa siddhique"],
response:"🎯 Aqsa ji ko log generally focused aur helpful nature ke liye jaante hain.vo hamare founder ki friend bhi hai aur deep imaginative peoples mai aati hai ."
},
    
{
keywords:["artificial intelligence","ai"],
response:"🤖 AI aisi technology hai jo machines ko learning aur decision-making jaise tasks karne mein help karti hai."
},

{
keywords:["robot"],
response:"🤖 Robot ek machine hai jo automatically ya programming ke according tasks perform kar sakti hai."
},

{
keywords:["space"],
response:"🌌 Space bahut vast hai aur ismein planets, stars, galaxies aur black holes hote hain."
},

{
keywords:["alien"],
response:"👽 Abhi tak aliens ke existence ka confirmed scientific proof nahi mila hai."
},

{
keywords:["fun fact"],
response:"🦈 Fun Fact: Sharks dinosaurs se bhi purani species hain."
},

{
keywords:["joke"],
response:"😂 Teacher: Homework kyu nahi kiya? Student: Sir, homework to ghar ka kaam hota hai, school ka thodi!"
},

{
keywords:["bored"],
response:"😄 Bore ho rahe ho? Kuch naya seekho, drawing karo, game khelo, ya interesting facts explore karo."
},
{
keywords:["mere bare mai batao"],
response:"😄 Tum apni kahani ke main character ho. Har insan ki apni strengths, interests aur goals hote hain. Agar tum apna naam bataoge aur profile saved hogi to main aur specific bata sakta hoon."
},
{
keywords:["hobby"],
response:"🎨 Hobby stress kam karti hai aur creativity badhati hai. Drawing, reading, coding, sports sab great hobbies hain."
},
    {
keywords:["i am rehan jafri","rehan jafri"],
response:"hello Sir! Aapka Medulla AI mein swagat hai.  Aap jaise teachers hi students ko inspire karte hain aur naye ideas ko reality mein badalne ka confidence dete hain. Mujhe dekhkar shayad aapko khushi hogi mai meri core programming languages mai 35% Java aur 45% Java script hai."
},
    
    {
keywords:["gyani sharma","i am gyani sharma","mera naam gyani hai"],
response:"🙏 Namaste Mata Ji! paye lagu Medulla AI mein aapka hardik swagat hai. Aasha karta hoon aapka din shubh aur khushiyon se bhara rahe."
},
  {
    keywords: ["linux", "terminal", "command line", "ubuntu", "kali", "bash", "shell"],
    response: `**Linux Master Karna Hai? Let's Go! 🐧**

### Essential Commands:
\`\`\`bash
ls -la          # File listing
cd /path        # Change directory
pwd             # Current path
cp src dest     # Copy
mv src dest     # Move/rename
rm -rf dir      # Delete (careful!)
chmod +x file   # Make executable
sudo apt update # Update system
\`\`\`

### Learning Path:
1. **Beginner:** Ubuntu/Mint install karo
2. **Intermediate:** Shell scripting
3. **Advanced:** System admin, networking
4. **Expert:** Kali Linux for security

Kaunsa area explore karna hai? 🎯`
  },
  {
    keywords: ["python", "python seekh", "python learn", "django", "flask"],
    response: `**Python — Best Language to Start! 🐍**

### Quick Example:
\`\`\`python
# Variables
name = "Medulla AI"
skills = ["Python", "AI", "Web"]

# Function
def greet(user):
    return f"Hello {user}!"

# List comprehension
squares = [x**2 for x in range(10)]

# File handling
with open("data.txt", "w") as f:
    f.write("Learning Python!")
\`\`\`

### Career Paths:
| Path | Tools |
|------|-------|
| Web | Django, Flask, FastAPI |
| Data | Pandas, NumPy |
| AI/ML | TensorFlow, PyTorch |
| Automation | Selenium, Scripts |

Kaunsa interesting lagta hai? 🎯`
  },
  {
    keywords: ["cybersecurity", "hacking", "ethical hacking", "security", "cyber", "pentesting"],
    response: `**Cybersecurity Career? Solid Choice! 🔒**

### Roadmap:
\`\`\`
Level 1: Foundation
├── Networking (TCP/IP, DNS)
├── Linux basics
└── Python + Bash

Level 2: Security
├── OWASP Top 10
├── Cryptography
└── Security tools

Level 3: Specialization
├── Web Security
├── Network Security
├── Penetration Testing
└── Cloud Security
\`\`\`

### Tools:
- **Recon:** Nmap, Shodan
- **Web:** Burp Suite, ZAP
- **Exploit:** Metasploit

### Practice:
- TryHackMe (beginner)
- HackTheBox (advanced)
- PortSwigger Academy (free!)

Kahan se start karein? 🛡️`
  },
  {
    keywords: ["javascript", "js", "web development", "frontend", "react", "node"],
    response: `**JavaScript — Web Ka King! ⚡**

### Modern JS:
\`\`\`javascript
// ES6+ Features
const user = { name: "Dev", skills: ["JS"] };
const { name } = user;

// Arrow Functions
const greet = (n) => \`Hello, \${n}!\`;

// Async/Await
const getData = async () => {
  const res = await fetch('/api');
  return res.json();
};

// Array Methods
const doubled = [1,2,3].map(n => n * 2);
\`\`\`

### Stacks:
| Frontend | Backend | Full-Stack |
|----------|---------|------------|
| React | Node.js | Next.js |
| Vue | Express | Nuxt |
| Svelte | Fastify | SvelteKit |

Frontend ya backend? 💻`
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "kaise ho", "how are you", "hii"],
    response: `Hey bhai! 👋 Kaise ho?

Main **Medulla AI** — tumhara AI buddy! 

Kuch bhi poochho:
- 💻 Coding help
- 🔒 Cybersecurity
- 📚 Learning
- 🎯 Career advice

Batao, kya karna hai? 🚀`
  },
  {
    keywords: ["thank", "thanks", "shukriya", "dhanyavaad", "thnx"],
    response: `Are bhai, koi baat nahi! 😊

Yahi toh mera kaam hai. Jab bhi doubt ho — aa jaana. 24/7 available hoon! 💪

Aur kuch help chahiye? 🚀`
  },
  {
    keywords: ["bye", "goodbye", "alvida", "see you", "nikalta"],
    response: `Bye bhai! 👋 

Jab bhi zaroorat ho, wapas aa jaana!

Keep learning, keep building! 🚀

*— Medulla AI*`
  },
    
  {
    keywords: ["error", "bug", "problem", "issue", "kaam nahi", "not working", "nahi ho raha"],
    response: `**Debug Mode! 🔧**

Error fix karne ke liye batao:

1. **Error message** (exact text)
2. **Kya kar rahe the**
3. **Language/Framework**
4. **Code snippet**

### Quick Debug Tips:
\`\`\`
1. Error message padho carefully
2. Console/terminal check karo
3. Recent changes revert karo
4. Google/Stack Overflow search
5. Code ko parts mein test karo
\`\`\`

Apna error paste karo! 💪`
  },
  {
    keywords: ["career", "job", "naukri", "placement", "salary", "interview"],
    response: `**Career Guidance! 🎯**

### Hot Tech Careers:
| Field | Salary | Skills |
|-------|--------|--------|
| Full-Stack | 8-25 LPA | JS, React, Node |
| Data Science | 10-30 LPA | Python, ML |
| Cloud | 8-20 LPA | AWS/Azure |
| Cybersecurity | 8-25 LPA | Security |
| AI/ML | 12-35 LPA | Python, DL |

### Tips:
1. Skills > Degree
2. Projects banao
3. GitHub strong rakho
4. LinkedIn active
5. DSA practice

Kaunsa field? Roadmap dunga! 📈`
  },
  {
    keywords: ["project", "idea", "banau kya", "build", "create"],
    response: `**Project Ideas! 💡**

### Beginner:
- Portfolio website
- To-do app
- Calculator
- Weather app (API)

### Intermediate:
- Blog platform
- E-commerce page
- Chat app
- URL shortener

### Advanced:
- Social media clone
- AI chatbot
- Real-time collab tool
- Video streaming

Skill level batao — specific suggest karunga! 🚀`
  },
  {
    keywords: ["api", "rest", "fetch", "axios", "http"],
    response: `**API Development! 🔌**

### REST API Basics:
\`\`\`javascript
// GET Request
const response = await fetch('/api/users');
const data = await response.json();

// POST Request
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'User' })
});
\`\`\`

### HTTP Methods:
| Method | Use |
|--------|-----|
| GET | Read data |
| POST | Create |
| PUT | Update (full) |
| PATCH | Update (partial) |
| DELETE | Remove |

API banana hai ya consume karna hai? 🎯`
  },
  {
    keywords: ["git", "github", "version control", "commit", "push"],
    response: `**Git & GitHub! 📦**

### Essential Commands:
\`\`\`bash
git init                    # Initialize
git add .                   # Stage all
git commit -m "message"     # Commit
git push origin main        # Push
git pull                    # Pull changes
git branch feature          # New branch
git checkout feature        # Switch branch
git merge feature           # Merge
\`\`\`

### Workflow:
1. Fork/Clone repo
2. Create feature branch
3. Make changes
4. Commit with clear message
5. Push & create PR

GitHub profile strong rakho — recruiters dekhte hain! 🚀`
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// GPT API INTEGRATION (Via Secure Proxy)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Call GPT API through secure backend proxy
 * ⚠️ Never expose API keys in frontend!
 */
async function callGPTAPI(message, history = []) {
  if (!CONFIG.GPT_API_ENABLED || !CONFIG.GPT_API_ENDPOINT) {
    return null;
  }

  try {
    const response = await fetch(CONFIG.GPT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        history: history.slice(-10), // Last 10 messages for context
        user: getCurrentUser()?.name || "User"
      })
    });

    if (!response.ok) {
      console.warn("GPT API error, falling back to internal KB");
      return null;
    }

    const data = await response.json();
    return data.response || data.message || null;

  } catch (error) {
    console.warn("GPT API call failed:", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSE GENERATION
// ═══════════════════════════════════════════════════════════════════════════

function searchKnowledge(query) {
  const lower = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const matchCount = entry.keywords.filter(kw => lower.includes(kw)).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = entry;
    }
  }

  return bestMatch ? bestMatch.response : null;
}

function generateContextualResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes("code") || lower.includes("program") || lower.includes("function")) {
    return `**Code Help! 💻**

Coding mein help ke liye batao:
1. **Language** — Python, JS, Java?
2. **Kya banana hai** — Function, class?
3. **Context** — Web, data, automation?

Ya seedha poochho jaise:
- "Python mein list sort karo"
- "JS mein API call kaise karein"

Poochho! 🚀`;
  }

  if (lower.includes("seekh") || lower.includes("learn") || lower.includes("start")) {
    return `**Learning Path! 📚**

Kya seekhna hai specifically?

### Approach:
1. **Foundation** — Basics samjho
2. **Practice** — Daily coding
3. **Build** — Projects banao
4. **Share** — Portfolio

Technology batao — detailed roadmap dunga! 🎯`;
  }

  return null;
}

/**
 * Main response generator
 * Priority: GPT API > Internal KB > Contextual > Fallback
 */
async function generateAIResponse(message, history = [], memories = []) {
  // Try GPT API first (if enabled)
  if (CONFIG.GPT_API_ENABLED) {
    const gptResponse = await callGPTAPI(message, history);
    if (gptResponse) {
      return gptResponse;
    }
  }

  // Fallback to internal knowledge base
  if (CONFIG.USE_INTERNAL_KB) {
    const kbResponse = searchKnowledge(message);
    if (kbResponse) {
      return kbResponse;
    }

    const contextual = generateContextualResponse(message);
    if (contextual) {
      return contextual;
    }
  }

  // Final fallback
  return `Interesting question! 🤔

Mujhe thoda detail chahiye:
1. Specifically kya jaanna hai?
2. Context kya hai?
3. Koi example?

Main tech, coding, cybersecurity, career pe help kar sakta hoon!

Ya [AK Industries](${CONFIG.AK_CONTACT_URL}) ko contact karo. 📩`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderMarkdown(text) {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = code.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${lang || "code"}</span><button class="copy-code-btn" onclick="copyCode(this)">📋 Copy</button></div><pre><code>${escaped}</code></pre></div>`;
  });

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
    const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Inline code, headings, bold, italic, links, blockquotes, lists
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^[*-] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul>$1</ul>");
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

function copyCode(btn) {
  const code = btn.closest(".code-block-wrapper").querySelector("code");
  if (code) {
    navigator.clipboard.writeText(code.textContent || "");
    btn.textContent = "✅ Copied!";
    setTimeout(() => btn.textContent = "📋 Copy", 2000);
  }
}
window.copyCode = copyCode;

// ═══════════════════════════════════════════════════════════════════════════
// CHAT OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

function addMessage(role, content) {
  const msg = {
    id: `${role}-${Date.now()}`,
    role: role,
    content: content,
    timestamp: new Date()
  };
  chatMessages.push(msg);
  
  if (currentSessionId) {
    saveChatLocally(currentSessionId, chatMessages);
  }
  return msg;
}

async function sendMessage(message) {
  addMessage("user", message);
  
  const user = getCurrentUser();
  const response = await generateAIResponse(message, chatMessages, user.memories || []);
  
  return addMessage("assistant", response);
}

function startNewChat() {
  currentSessionId = `session-${Date.now()}`;
  chatMessages = [];
}

function loadChatSession(sessionId) {
  const chats = loadChatsLocally();
  if (chats[sessionId]) {
    currentSessionId = sessionId;
    chatMessages = chats[sessionId].messages || [];
    return chatMessages;
  }
  return [];
}

function getChatSessions() {
  const chats = loadChatsLocally();
  return Object.keys(chats).map(id => ({
    id: id,
    title: chats[id].messages?.[0]?.content?.substring(0, 40) || "New Chat",
    updatedAt: chats[id].updatedAt
  })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function deleteChatSession(sessionId) {
  deleteChatLocally(sessionId);
  if (currentSessionId === sessionId) startNewChat();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

console.log("✅ Chat engine loaded");
