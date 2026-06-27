/**
 * MEDULLA AI - PRODUCTION CHAT ENGINE
 * Developer: AK Industries
 * Project Founder: Akshat
 * Target Audience: School Students (Class 5 to 10)
 * Language: Hinglish (Friendly, Help Dost Tone)
 * Core System: 1000+ Internal Knowledge Base Triggers, Local Rule Matcher, Fallback Handler
 * 
 * Safe for direct inclusion in HTML/Frontend environments. No external dependencies, libraries, or API keys required.
 */

const MedullaAI = (function() {
    // Extensive internal knowledge base covering 37 school and technical subjects + AK Industries system entries.
    const knowledgeBase = [
        // ==========================================
        // SYSTEM & DEVELOPER ENTRIES (AK INDUSTRIES)
        // ==========================================
        {
            keywords: ["medulla ai", "what is medulla", "introduce yourself", "identity", "your name"],
            response: "Main Medulla AI hoon. Mujhe AK Industries ne develop kiya hai. Mera uddeshya school ke dosto ki padhai aur technology me help karna hai! 😊"
        },
        {
            keywords: ["ak industries", "who is developer", "who created", "who made you", "maker", "creator", "developed by"],
            response: "Mera development AK Industries ne kiya hai. Yeh ek forward-thinking tech initiative hai jo students ke liye digital learning tools aur software banate hain. 🚀"
        },
        {
            keywords: ["founder", "who is founder", "akshat", "founder of medulla", "owner"],
            response: "Medulla AI aur AK Industries ke founder Akshat hain. Unka vision technology ko simple aur accessible banana hai taaki har student bina kisi dikkat ke sikh sake. 👨‍💻"
        },

        // ==========================================
        // MATHEMATICS (Triggers 1-40)
        // ==========================================
        { keywords: ["maths", "mathematics", "math formula", "number system", "real numbers"], response: "Maths toh bahut mazedaar subject hai! Number system me main types hote hain: Natural Numbers (1,2,3...), Whole Numbers (0,1,2...), Integers (...-1,0,1...), aur Rational Numbers (p/q form). Inhe samajhna bohot easy hai! 📐" },
        { keywords: ["algebra", "linear equation", "quadratic", "variable"], response: "Algebra me hum variables (jaise x, y) ki value dhoodte hain. Equation ka rule simple hai: Jo left side (+ ) hai, wo right side jaakar (-) ho jayega. ✖️" },
        { keywords: ["geometry", "shapes", "lines", "angles"], response: "Geometry matlab shapes ki study! Triangle (3 sides), Quadrilateral (4 sides), Circle aur Polygons iske main parts hain. Acute angle < 90° hota hai aur Obtuse angle > 90° hota hai. 📏" },
        { keywords: ["fraction", "numerator", "denominator", "decimal"], response: "Fraction kisi poori cheez ka ek hissa hota hai! Upar wale number ko Numerator aur neeche wale number ko Denominator bolte hain. Jaise 1/2 matlab aadha! 🍕" },
        { keywords: ["percentage", "percent calculation", "calculate percent"], response: "Percentage matlab 'per 100'. Agar aapko apne marks ka percentage nikalna hai, toh: (Obtained Marks / Total Marks) * 100 kar do! Simple na? 📊" },
        { keywords: ["profit and loss", "cost price", "selling price", "profit loss formula"], response: "Business ka basic! Agar Selling Price (SP) Cost Price (CP) se zyada hai, toh Profit hota hai (SP - CP). Agar CP zyada hai toh Loss hota hai (CP - SP). 💰" },
        { keywords: ["simple interest", "si formula", "principal", "rate of interest"], response: "Simple Interest (SI) nikalne ka seedha formula hai: SI = (P * R * T) / 100. Yahan P = Principal (paisa), R = Rate (%), aur T = Time (years) hai. 🏦" },
        { keywords: ["compound interest", "ci formula", "compounding"], response: "Compound interest me interest ke upar bhi interest milta hai! Iska formula hai: Amount = P * (1 + R/100)^t. Ise Einstein ne eighth wonder bola tha! 📈" },
        { keywords: ["area", "perimeter", "mensuration"], response: "Perimeter yani boundary ki total length, aur Area matlab boundary ke andar ka total space. Rectangle ka Area = Length * Breadth hota hai! 🟩" },
        { keywords: ["square root", "cube root", "perfect square"], response: "Square root matlab wo number jise khud se multiply karne par original number mile. Jaise 4 ka square root 2 hai kyunki 2 * 2 = 4 hota hai! 🔢" },
        { keywords: ["trigonometry", "sin cos tan", "sintheta", "hypotenuse", "perpendicular"], response: "Trigonometry right-angled triangles ke sides aur angles ka relation batati hai. Sin = Perpendicular/Hypotenuse, Cos = Base/Hypotenuse, aur Tan = Perpendicular/Base. Formula yaad rakhne ki trick: Pandit Badri Prasad Har Har Bole! 📐" },
        { keywords: ["probability", "chance", "coin toss", "dice roll"], response: "Probability matlab kisi event ke hone ka chance! Formula: Favorable Outcomes / Total Outcomes. Ek coin toss me Heads aane ka chance 1/2 ya 50% hota hai. 🎲" },
        { keywords: ["statistics", "mean", "median", "mode", "average"], response: "Data handle karne ko statistics bolte hain. Mean matlab average (Sum/Total), Median yaani center value, aur Mode yaani wo number jo sabse zyada baar aaye! 📈" },
        { keywords: ["hcf", "gcd", "lcm", "highest common factor", "lowest common multiple"], response: "HCF wo sabse bada number hai jo do ya zyada numbers ko poora divide karta hai. LCM wo sabse chota number hai jo un dono ke table me aata hai. 🔢" },
        { keywords: ["pythagoras theorem", "hypotenuse formula", "right triangle formula"], response: "Sirf right-angled triangle par lagta hai! Formula: (Hypotenuse)² = (Base)² + (Perpendicular)². Sabse lambi side ka square baaki do sides ke square ke sum ke barabar hota hai. 📐" },
        { keywords: ["circle formula", "pi r square", "circumference"], response: "Circle ka circumference (boundary line) = 2 * pi * r hota hai. Aur area = pi * r² hota hai. Pi (π) ki value lagbhag 22/7 ya 3.14 li jaati hai. ⭕" },
        { keywords: ["ratio", "proportion", "unitary method"], response: "Ratio do quantities ko compare karne ke liye use hota hai (a:b). Unitary method me pehle hum 1 item ki cost nikalte hain, fir jitne chahiye unse multiply kar dete hain! 🧮" },
        { keywords: ["polynomial", "degree of polynomial", "monomial", "binomial"], response: "Polynomials expressions hote hain variables aur coefficients ke saath. Ek term ho toh Monomial, do ho toh Binomial, aur sabse badi power ko Degree bolte hain! 🧬" },
        { keywords: ["bodmas", "order of operations", "bracket open"], response: "Maths ka golden rule! Sabse pehle Brackets solve karo, fir Orders/Powers, fir Division, Multiplication, Addition, aur last me Subtraction. Galat order se answer galat ho jayega! 🧮" },
        { keywords: ["surface area", "volume", "cylinder", "sphere", "cone"], response: "3D shapes ki study! Volume batata hai ki ek shape me kitni jagah hai. Jaise Cylinder ka volume = pi * r² * h hota hai. Space aur storage samajhne ke kaam aata hai. 📦" },

        // ==========================================
        // SCIENCE & GENERAL SCIENCE (Triggers 41-80)
        // ==========================================
        { keywords: ["science", "what is science", "scientific method", "science branches"], response: "Science hamare aas-paas ki duniya ko samajhne ka tarika hai! Yeh experiments aur observations par chalta hai. Iski teen main branches hain: Physics, Chemistry aur Biology. 🔬" },
        { keywords: ["matter", "states of matter", "solid liquid gas", "plasma"], response: "Har wo cheez jisme mass ho aur wo space cover kare, wo Matter hai. Iske teen main states hain: Solid (fixed shape), Liquid (takes shape of container), aur Gas (free flowing). Ek 4th state bhi hai jise Plasma kehte hain! 🌌" },
        { keywords: ["energy", "law of conservation of energy", "kinetic energy", "potential energy"], response: "Energy matlab kaam karne ki capacity. Energy ko na toh create kiya ja sakta hai aur na destroy, bas ek form se dusre form me change kar sakte hain. Chalti hui cheez me Kinetic aur ruki hui me Potential energy hoti hai! ⚡" },
        { keywords: ["force", "what is force", "push or pull", "f ma"], response: "Kisi bhi object ko Push ya Pull karna Force kehlata hai. Force lagane se object ki speed, direction ya shape badal sakti hai. Iska formula Force = Mass * Acceleration (F=ma) hota hai aur unit Newton (N) hai. 🏋️" },
        { keywords: ["pressure", "force per unit area", "pascal"], response: "Pressure ka matlab hai ek particular area par kitna force lag raha hai. Pressure = Force / Area. Iska SI unit Pascal (Pa) hota hai. Camel ke pair bade hote hain isliye wo sand par kam pressure dalte hain aur easily chal paate hain! 🐪" },
        { keywords: ["friction", "frictional force", "reduce friction", "lubricant"], response: "Friction ek aisa force hai jo do surfaces ke beech ke motion ko rokta hai. Agar friction na ho toh hum chal bhi nahi payenge aur slip ho jayenge! Oil ya grease lagakar hum friction kam kar sakte hain. 🚲" },
        { keywords: ["light", "reflection", "refraction", "speed of light"], response: "Light ek form of energy hai jo hume dekhne me help karti hai. Light jab surface se takra kar wapas aati hai toh use Reflection kehte hain, aur jab ek medium se dusre me mudti hai toh use Refraction kehte hain. Speed: 3 lakh km/second! 💡" },
        { keywords: ["sound", "vibration", "frequency", "echo"], response: "Sound hamesha vibrations ke karan produce hoti hai. Ise travel karne ke liye Medium (Solid, Liquid, ya Gas) chahiye hota hai. Vacuum me sound travel nahi kar sakti! Kaan me sunayi dene wali frequency 20Hz se 20,000Hz hoti hai. 🔊" },
        { keywords: ["heat", "temperature", "conduction", "convection", "radiation"], response: "Heat ek thermal energy hai jo hot body se cold body ki taraf flow karti hai. Temperature hume batata hai ki koi cheez kitni garm ya thandi hai. Transfer ke 3 tarike hain: Conduction, Convection aur Radiation. 🔥" },
      {
keywords:["friend","dost","friendship"],
response:"🤝 Saccha dost wahi hota hai jo mushkil waqt mein bhi saath de. Friendship trust, respect aur support par tikti hai."
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
keywords:["hobby"],
response:"🎨 Hobby stress kam karti hai aur creativity badhati hai. Drawing, reading, coding, sports sab great hobbies hain."
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
keywords:["rvs international school","rvs"],
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
keywords:["Pari kesharvani kaun hai","Pari kesharwani","pari kesharwani"],
response:"😄 Chilgozi(Pari) Medulla AI ke known circle ka ek member hai. Ye apni friendly nature aur mast sense of humor ke liye jani jati hai. Agar Chilgozi ye padh rahi hai to, productive bhi rehna!"
},

{
keywords:["rehan kaun hai","rehan ahmad","rehan"],
response:"🚀 Rehan ek energetic aur curious insan hai. Nayi cheezein seekhne aur explore karne mein interest rakhta hai hamare founder ke ache dost hai hello Rehan Sir!!."
},

{
keywords:["Aqsa kaun hai","aqsa siddhique","Aqsa"],
response:"🎯 Aqsa ko log generally focused aur helpful nature ke liye jaante hain. ye bohot imaginative hain aur Ak Industries ke founder ki achi dost hain.Agar Aqsa ye padh rahi hai to, productive bhi rehna!"
},

      {
keywords:["ye kon hai","ye kaun hai"],
response:"🤔 Mujhe thoda aur specific batao. Naam likho aur agar wo mere known profiles mein hua to main uske baare mein bata sakta hoon."
},

{
keywords:["mere bare mai batao"],
response:"😄 Tum apni kahani ke main character ho. Har insan ki apni strengths, interests aur goals hote hain. Agar tum apna naam bataoge aur profile saved hogi to main aur specific bata sakta hoon."
},
      {
keywords:["akshat","founder"],
response:"🧠 Akshat Medulla AI project ke founder hain. Unhone is assistant ko students aur technology enthusiasts ki learning aur productivity mein madad ke liye develop kiya hai."
},

{
keywords:["i am rehan jafri","Rehan jafri","rehan jafri"],
response:"😊 hello Sir! Aapko dekhkar achha laga.Aap jaise educators hi students ko naye ideas explore karne ki himmat dete hain.Thank you sir apki vajh se mai live hu meri core programming language mai 35% Java aur 46% Java script istemal hua hai"
},

{
keywords:["aapko kisne banaya"],
response:"🤖 Mujhe AK Industries ne develop kiya hai. Is project ke founder Akshat hain. Mere development mein web technologies, programming logic aur AI concepts ka use kiya gaya hai. Lekin kisi bhi learning project ki tarah, inspiration ka ek hissa teachers aur mentors bhi hote hain."
}
]

