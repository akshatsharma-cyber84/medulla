
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
