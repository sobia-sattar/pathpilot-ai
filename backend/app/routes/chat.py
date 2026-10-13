"""
PathPilot AI - Multilingual High-Accuracy AI Career Buddy (Pip)
Provides precision career guidance, concept explanations, roadmap milestones,
interview questions, and team introductions.
Fully supports English, Urdu (اردو), and Roman Urdu with context awareness.
"""

from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import List, Optional
import re
import random

router = APIRouter(prefix="/api/chat", tags=["AI Career Buddy"])

class ChatRequest(BaseModel):
    message: str
    target_role: Optional[str] = "Junior AI/ML Engineer"
    readiness_score: Optional[int] = 42
    missing_skills: Optional[List[str]] = None
    active_milestone: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str]
    mood: str
    language: str

def is_urdu_script(text: str) -> bool:
    # Arabic / Urdu Unicode Range
    return bool(re.search(r'[\u0600-\u06FF]', text))

def is_roman_urdu(text: str) -> bool:
    t = text.lower()
    roman_urdu_words = [
        "kaise", "kaisay", "kese", "kya", "kya karun", "mujhe", "batao", "bataen",
        "sikhna", "seekhein", "tayari", "tayyari", "meri", "mera", "mere", "hai",
        "hain", "shukriya", "madad", "salam", "assalam", "walaikum", "kaun", "koun",
        "karen", "karo", "acha", "theek", "job", "naukri", "parhna", "parhai",
        "agla", "agli", "rasta", "kahan", "kitna", "kitni", "banao", "kis ne", "kisne"
    ]
    return any(re.search(r'\b' + re.escape(w) + r'\b', t) for w in roman_urdu_words)

@router.post("/message", response_model=ChatResponse)
async def chat_with_pip(
    payload: ChatRequest,
    x_user_email: Optional[str] = Header(None)
):
    raw_msg = payload.message.strip()
    user_msg = raw_msg.lower()
    role = payload.target_role or "Junior AI/ML Engineer"
    score = payload.readiness_score or 42
    missing = payload.missing_skills or ["Machine Learning", "PyTorch", "Model Evaluation"]
    top_gap = missing[0] if missing else "Machine Learning"
    milestone = payload.active_milestone or "Establish Foundations in Python"

    # =========================================================================
    # 1. URDU SCRIPT (اردو رسم الخط)
    # =========================================================================
    if is_urdu_script(raw_msg):
        lang = "urdu"
        
        # Team / Creators inquiry in Urdu
        if any(w in raw_msg for w in ["کس نے بنایا", "ٹیم", "سازندہ", "بانی", "ثوبیہ", "حسن", "سمیرا", "سمرا"]):
            reply = (
                f"پاتھ پائلٹ (PathPilot) کو تین باصلاحیت طلباء نے پیار اور لگن سے بنایا ہے! 🌟\n\n"
                f"👩‍💻 **ثوبیہ ستار (Sobia Sattar)** — پروجیکٹ لیڈ اور AI سسٹمز آرکیٹیکٹ\n"
                f"👨‍💻 **محمد حسن (Muhammad Hassan)** — ڈیٹا انجینئرنگ اور بیک اینڈ انٹیلیجنس لیڈ\n"
                f"👩‍🎨 **سمیرا شار (Sumera Shar)** — لیڈ ڈیزائنر اور کری ایٹو پروڈکٹ انجینئر\n\n"
                f"آپ اوپر نیویگیشن میں **'Our Team'** پر کلک کر کے ان کے بارے میں مزید پڑھ سکتے ہیں! 🐾"
            )
            suggestions = [
                "ریڈینیس اسکور کیسے بڑھائیں؟",
                f"{top_gap} کیسے سیکھیں؟",
                "انٹرویو کی تیاری کیسے کریں؟"
            ]
            mood = "proud"

        elif any(w in raw_msg for w in ["سلام", "ہیلو", "کون ہو", "کون ہیں", "کیسے ہو", "کیا حال"]):
            reply = (
                f"وعلیکم السلام! میں **پِپ (Pip)** ہوں، آپ کا پیارا AI کیریئر گائیڈ! 🐾✨\n\n"
                f"آپ کا موجودہ ہدف **{role}** ہے اور تیاری کا اسکور **{score}%** ہے۔\n\n"
                f"آپ مجھ سے کیریئر روڈ میپ، تکنیکی سوالات، یا ہنر سیکھنے کے متعلق کچھ بھی پوچھ سکتے ہیں۔ بتائیں میں آپ کی کیا مدد کروں؟"
            )
            suggestions = [
                f"{top_gap} کیسے سیکھیں؟",
                "اگلا قدم کیا ہونا چاہیے؟",
                "ریڈینیس اسکور کیسے بڑھائیں؟",
                "انٹرویو کی تیاری کیسے کریں؟"
            ]
            mood = "happy"

        elif any(w in raw_msg for w in ["گریڈینٹ", "ڈیسنٹ", "مشین لرننگ", "اوور فٹنگ"]):
            reply = (
                f"**مشین لرننگ کا اہم تصور:** 🧠\n\n"
                f"• **Gradient Descent**: یہ ایک الگورتھم ہے جو ماڈل کی غلطی (Loss) کو کم سے کم کرتا ہے۔ یہ ڈھلوان کے مخالف سمت میں قدم اٹھا کر بہترین ویٹس (Weights) تلاش کرتا ہے۔\n\n"
                f"• **Overfitting**: جب ماڈل ٹریننگ ڈیٹا کو رٹ لے لیکن نئے ڈیٹا پر فیل ہو جائے۔ اس کا حل Regularization، Dropout، یا زیادہ ڈیٹا فراہم کرنا ہے۔"
            )
            suggestions = [
                "Precision اور Recall کا فرق بتائیں",
                f"{top_gap} کی مشق کیسے کریں؟",
                "انٹرویو کے اہم سوالات"
            ]
            mood = "academic"

        elif any(w in raw_msg for w in ["اسکور", "مارکس", "فیصد", "ریڈینیس", "فارمولا"]):
            reply = (
                f"آپ کا موجودہ کیریئر ریڈینیس اسکور **{score}%** ہے! 🎯\n\n"
                f"**اسکور کا شفاف حسابی فارمولا:**\n"
                f"• لازمی ہنر (Must-Have) کو 3 گنا زیادہ وزن ملتا ہے۔\n"
                f"• اضافی ہنر (Preferred) کو 2 گنا وزن ملتا ہے۔\n\n"
                f"جب آپ **{top_gap}** کے مائل اسٹون کو مکمل کریں گے اور کوڈ سینڈ باکس میں ٹیسٹ پاس کریں گے، آپ کا اسکور فوری طور پر بڑھ جائے گا! 📈"
            )
            suggestions = [
                f"{top_gap} کی تفصیل بتائیں",
                "اگلا مائل اسٹون کیا ہے؟",
                "کوئی حوصلہ افزائی کا جملہ بتائیں"
            ]
            mood = "analytical"

        elif any(w in raw_msg for w in ["کیسے سیکھوں", "سیکھنا", "کیا پڑھوں", "روڈ میپ", "ہنر"]):
            reply = (
                f"سب سے پہلے آپ کو اپنے اہم ترین گیپ **{top_gap}** پر توجہ دینی چاہیے! 💡\n\n"
                f"آپ کا موجودہ ایکٹو مرحلہ ہے:\n"
                f"👉 **{milestone}**\n\n"
                f"**کامیابی کے 3 اصول:**\n"
                f"1. روڈ میپ ٹیب کھولیں اور ویڈیو لیکچر دیکھیں۔\n"
                f"2. کوڈ سینڈ باکس میں پریکٹس ٹاسک چلائیں۔\n"
                f"3. اپنا پروجیکٹ مکمل کر کے GitHub پر اپلوڈ کریں! 🚀"
            )
            suggestions = [
                "انٹرویو کے سوالات بتائیں",
                "کوڈنگ پریکٹس کیسے کروں؟",
                "حوصلہ افزائی کا پیغام"
            ]
            mood = "coaching"

        elif any(w in raw_msg for w in ["انٹرویو", "نوکری", "جاب", "سوال"]):
            reply = (
                f"**{role}** کے انٹرویو کے لیے یہ 3 سوالات لازمی تیار کریں: 💼\n\n"
                f"1. *Precision اور Recall میں بنیادی فرق کیا ہے؟*\n"
                f"2. *Gradient Descent کیسے کام کرتا ہے اور Learning Rate کا کیا کردار ہے؟*\n"
                f"3. *اپنے کسی مکمل پروجیکٹ کی وضاحت کریں جو آپ نے خود بنایا ہو۔*\n\n"
                f"کیا آپ چاہتے ہیں کہ میں ان میں سے کسی کا تفصیلی جواب سمجھاؤں؟"
            )
            suggestions = [
                "Precision اور Recall کا فرق بتائیں",
                "گریڈینٹ ڈیسنٹ کی وضاحت کریں",
                "پراجیکٹ آئیڈیاز بتائیں"
            ]
            mood = "interview_prep"

        else:
            reply = (
                f"بہت خوب! میں **{role}** کے سفر میں آپ کے ساتھ ہوں۔ 🐾\n\n"
                f"آپ کے لیے سب سے اہم ہنر **{top_gap}** ہے۔ آپ مجھ سے پائتھن، روڈ میپ، یا انٹرویو کے متعلق اردو یا انگلش میں کچھ بھی پوچھ سکتے ہیں!"
            )
            suggestions = [
                f"{top_gap} کیسے سیکھیں؟",
                "ریڈینیس اسکور کیسے بڑھائیں؟",
                "انٹرویو کی تیاری"
            ]
            mood = "friendly"

    # =========================================================================
    # 2. ROMAN URDU (رومن اردو)
    # =========================================================================
    elif is_roman_urdu(raw_msg):
        lang = "roman_urdu"

        # Team / Creators inquiry in Roman Urdu
        if any(w in user_msg for w in ["kis ne banaya", "kisne banaya", "team", "creator", "founders", "sobia", "hassan", "sumera", "sumra"]):
            reply = (
                f"PathPilot ko 3 passionate university students ne banaya hai! 🌟👩‍💻👨‍💻👩‍🎨\n\n"
                f"• **Sobia Sattar** — Co-Founder & AI Systems Lead\n"
                f"• **Muhammad Hassan** — Co-Founder & Data Intelligence Lead\n"
                f"• **Sumera Shar** — Co-Founder & Creative Product Lead\n\n"
                f"Unho ne yeh platform is liye banaya taake har student ko clear roadmap aur transparent career advice mil sakay! Left sidebar mein **'Our Team'** tab par click kar ke un ka pura story parhein! 🐾"
            )
            suggestions = [
                f"{top_gap} kaise seekhein?",
                "Readiness score kaise barhayen?",
                "Interview tips batao"
            ]
            mood = "proud"

        elif any(w in user_msg for w in ["salam", "assalam", "hello", "hi", "kaun ho", "koun ho", "kese ho", "kaise ho"]):
            reply = (
                f"Walaikum Assalam! Main hoon **Pip**, aap ka cute AI Career Buddy! 🐾✨\n\n"
                f"Aap ka target role **{role}** hai aur abhi aap ka readiness score **{score}%** hai.\n\n"
                f"Aap mujh se Urdu, English ya Roman Urdu mein career guidance, technical concepts, ya interview tips pooch sakte hain! Batayein aaj kya seekhna hai?"
            )
            suggestions = [
                f"{top_gap} kaise seekhein?",
                "Agla step kya hona chahiye?",
                "Readiness score kaise barhayen?",
                "Interview ki tayari kaise karein?"
            ]
            mood = "happy"

        elif any(w in user_msg for w in ["gradient", "descent", "overfitting", "machine learning", "model"]):
            reply = (
                f"Yeh Machine Learning ka bohot zaroori concept hai: 🧠\n\n"
                f"• **Gradient Descent**: Yeh model ke error (Loss) ko kam karne ka algorithm hai. Yeh slopes check kar ke weights ko behtar banata hai.\n\n"
                f"• **Overfitting**: Jab model training data ko zabaani yaad kar le lekin new test data par fail ho jaye. Isay fix karne ke liye Regularization, Dropout, ya mazeed data use kiya jata hai!"
            )
            suggestions = [
                "Precision vs Recall samjhao",
                f"{top_gap} ki practice kaise karein?",
                "Interview ke sawalat"
            ]
            mood = "smart"

        elif any(w in user_msg for w in ["score", "readiness", "marks", "percent", "formula"]):
            reply = (
                f"Aap ka current readiness score **{score}%** hai for **{role}**! 🎯\n\n"
                f"**Score calculation ka transparent tareeqa:**\n"
                f"• Must-Have skills ka 3x weight hota hai.\n"
                f"• Preferred skills ka 2x weight hota hai.\n\n"
                f"**Score barhanay ke liye:**\n"
                f"1. Apne active milestone (**{milestone}**) ke lecture videos dekhein.\n"
                f"2. Code sandbox mein ja kar verification lab run karein.\n"
                f"3. **{top_gap}** jaise missing skills ko complete karein, score foran jump karega! 📈"
            )
            suggestions = [
                f"{top_gap} kaise seekhein?",
                "Agla milestone kya hai?",
                "Mujhe motivation dein!"
            ]
            mood = "analytical"

        elif any(w in user_msg for w in ["kaise", "seekhein", "sikhna", "kya karun", "parhun", "roadmap", "gap"]):
            reply = (
                f"Aap ke profile ke mutabiq, sab se zaroori focus **{top_gap}** par hona chahiye! 💡\n\n"
                f"Aap ka abhi active milestone yeh hai:\n"
                f"👉 **{milestone}**\n\n"
                f"**Mera Mashwara:**\n"
                f"• Daily 30 se 45 minutes Roadmap tab mein practice karein.\n"
                f"• Video lectures ko achi tarah samajhein aur notes banayein.\n"
                f"• Code lab mein code test karein aur GitHub par project upload karein! 🚀"
            )
            suggestions = [
                "Interview ke sawalat batao",
                "Code sandbox tips",
                "Mujhe motivate karein!"
            ]
            mood = "coaching"

        elif any(w in user_msg for w in ["interview", "job", "naukri", "sawal"]):
            reply = (
                f"**{role}** ke technical interview ke liye yeh 3 sawal zaroor tayar karein: 💼\n\n"
                f"1. *Precision aur Recall mein basic farq kya hai?*\n"
                f"2. *Gradient Descent optimization kaise kaam karta hai?*\n"
                f"3. *Aap ne jo end-to-end project banaya hai, uski architecture explain karein.*\n\n"
                f"Kya aap chahte hain ke main in mein se kisi sawal ka sample answer samjhaoon?"
            )
            suggestions = [
                "Precision vs Recall samjhao",
                "Gradient Descent kya hai?",
                "Best project ideas"
            ]
            mood = "interview_prep"

        elif any(w in user_msg for w in ["precision", "recall"]):
            reply = (
                f"Bohot acha sawal! Aasan lafzon mein yaad rakhein: 🧠\n\n"
                f"• **Precision** = *Jitne positive predictions kiye, un mein se kitne waqai theek thay?*\n"
                f"  `Precision = TP / (TP + FP)`\n"
                f"  (Yeh spam filters mein zaroori hota hai jahan ahem email ghalati se spam na ban jaye)\n\n"
                f"• **Recall** = *Jitne asal mein positive cases thay, un mein se hum kitne pakar sake?*\n"
                f"  `Recall = TP / (TP + FN)`\n"
                f"  (Yeh medical checkup ya fraud detection mein zaroori hota hai jahan koi case miss na ho)\n\n"
                f"• **F1-Score**: Precision aur Recall ka harmonic mean hota hai!"
            )
            suggestions = [
                "Gradient Descent samjhao",
                "Agla milestone kya hai?",
                "Interview tips"
            ]
            mood = "smart"

        elif any(w in user_msg for w in ["motivat", "thak", "mushkil", "himmat"]):
            reply = (
                f"Fikr bilkul mat karein! Har senior software engineer ne zero se start kiya tha. 🌟\n\n"
                f"Aap already **{score}%** benchmark match tak pohnch chuke hain! Bas daily thora waqt code karein, consistent rehne se mushkil se mushkil topic bhi aasan lagne lagta hai! Pip aap ke saath hai! 💪🚀"
            )
            suggestions = [
                "Agla milestone kya hai?",
                "Ek mazedaar coding fact sunayein",
                "Interview ki tayari"
            ]
            mood = "cheering"

        else:
            reply = (
                f"Main aap ke saath hoon! **{role}** ke raste par aap ka agla target **{top_gap}** hai. 🐾\n\n"
                f"Aap mujh se coding concepts, syntax, interviews ya roadmap ke baare mein Roman Urdu ya English mein be-jhijhak pooch sakte hain!"
            )
            suggestions = [
                f"{top_gap} kaise seekhein?",
                "Readiness score kaise barhayen?",
                "Interview tips"
            ]
            mood = "friendly"

    # =========================================================================
    # 3. ENGLISH (DEFAULT)
    # =========================================================================
    else:
        lang = "english"

        # Team / Creators inquiry in English
        if any(w in user_msg for w in ["who made", "who built", "who created", "created", "creator", "creators", "founders", "team", "developed", "developers", "sobia", "hassan", "sumera", "sumra"]):
            reply = (
                f"PathPilot was created with passion by an ambitious trio of student founders! 🌟\n\n"
                f"👩‍💻 **Sobia Sattar** — Co-Founder & AI Systems Lead\n"
                f"👨‍💻 **Muhammad Hassan** — Co-Founder & Data Intelligence Lead\n"
                f"👩‍🎨 **Sumera Shar** — Co-Founder & Creative Product Lead\n\n"
                f"They united AI architecture, data engineering, and human-centered design to eliminate career confusion for aspiring engineers. Click the **'Our Team'** tab in the sidebar to read their full story! 🐾"
            )
            suggestions = [
                f"How do I learn {top_gap}?",
                "Explain my readiness score",
                "Top interview questions"
            ]
            mood = "proud"

        elif any(w in user_msg for w in ["hi", "hello", "hey", "who are you", "what can you do"]):
            reply = (
                f"Hey there! I'm **Pip**, your cute AI Career Buddy! 🐾✨\n\n"
                f"I'm here to support your journey toward becoming a **{role}**! "
                f"Your current readiness score is **{score}%**.\n\n"
                f"You can ask me questions in **English**, **اردو (Urdu)**, or **Roman Urdu**!\n"
                f"• *How do I close my skill gaps?*\n"
                f"• *Explain {top_gap} or ML concepts like Gradient Descent*\n"
                f"• *Give me top interview questions for {role}*"
            )
            suggestions = [
                f"How do I learn {top_gap}?",
                "What should I study next?",
                "Explain my readiness score",
                "Give me a motivation boost!"
            ]
            mood = "happy"

        elif any(w in user_msg for w in ["gradient", "descent", "overfitting", "underfitting", "regularization", "bias"]):
            reply = (
                f"Here is a precision breakdown of core ML engineering fundamentals: 🧠\n\n"
                f"• **Gradient Descent**: An iterative optimization algorithm that minimizes the loss function by computing the gradient and taking steps proportional to the negative slope.\n"
                f"  - *Learning Rate (α)* controls step size. Too high causes divergence; too low makes training painfully slow.\n\n"
                f"• **Overfitting vs Underfitting**:\n"
                f"  - *Overfitting* (High Variance): Model memorizes training noise. Fix with L1/L2 Regularization, Dropout, data augmentation, or early stopping.\n"
                f"  - *Underfitting* (High Bias): Model is too simplistic. Fix by adding capacity (layers/features)."
            )
            suggestions = [
                "Explain Precision vs Recall",
                "What is ROC-AUC?",
                f"How to learn {top_gap}?"
            ]
            mood = "academic"

        elif any(w in user_msg for w in ["sql", "join", "database", "postgres"]):
            reply = (
                f"Database proficiency is fundamental for engineering and analytics! 💾\n\n"
                f"• **JOIN Types**:\n"
                f"  - `INNER JOIN`: Returns records matching in both tables.\n"
                f"  - `LEFT JOIN`: Returns all records from the left table and matched rows from the right.\n"
                f"• **Window Functions**: `ROW_NUMBER()`, `RANK()`, `LEAD()` allow calculations across row partitions without collapsing rows like `GROUP BY`.\n"
                f"• **Indexing**: B-Tree indexes speed up lookups from O(N) to O(log N)."
            )
            suggestions = [
                "Give me SQL interview questions",
                "Explain my readiness score",
                "What should I study next?"
            ]
            mood = "academic"

        elif any(w in user_msg for w in ["react", "component", "frontend", "hook"]):
            reply = (
                f"Modern frontend development with React: ⚛️\n\n"
                f"• **Virtual DOM**: React keeps an in-memory representation of UI, diffs it via reconciliation, and batches updates to minimize costly real DOM repaints.\n"
                f"• **Hooks**:\n"
                f"  - `useState`: Manages local component state.\n"
                f"  - `useEffect`: Manages side effects (fetching, subscriptions, timers).\n"
                f"  - `useMemo` / `useCallback`: Prevents redundant calculations and child re-renders."
            )
            suggestions = [
                "Full-Stack interview tips",
                "How do I close my skill gaps?",
                "What should I study next?"
            ]
            mood = "academic"

        elif any(w in user_msg for w in ["readiness", "score", "match", "percent", "percentage", "formula"]):
            reply = (
                f"Your current benchmark readiness is **{score}%** for **{role}**! 🎯\n\n"
                f"**PathPilot Transparent Scoring Formula:**\n"
                f"• **Must-Have Core Skills**: Weighted at **3x** (e.g. {top_gap}).\n"
                f"• **Preferred Skills**: Weighted at **2x**.\n"
                f"• Gap calculation: `max(0, required_level - current_level)`.\n\n"
                f"Completing your active milestone (**{milestone}**) and testing in the code sandbox will directly elevate your score! 📈"
            )
            suggestions = [
                f"How to learn {top_gap}?",
                "Tell me about my next milestone",
                "Give me interview questions"
            ]
            mood = "analytical"

        elif any(w in user_msg for w in ["gap", "missing", "learn", "study", "what next", "roadmap"]):
            reply = (
                f"Based on your profile analysis, your highest-priority gap is: **{top_gap}**! 💡\n\n"
                f"Your active roadmap milestone right now:\n"
                f"👉 **{milestone}**\n\n"
                f"**Recommended Action Plan:**\n"
                f"1. Open the **Roadmap** tab and click **'Watch Lesson Video'**.\n"
                f"2. Launch the **Code Lab** to run hands-on exercises.\n"
                f"3. Mark the milestone complete to immediately update your analytics! 🚀"
            )
            suggestions = [
                "Interview prep tips",
                "Code sandbox exercises",
                "Give me a motivation boost!"
            ]
            mood = "coaching"

        elif any(w in user_msg for w in ["interview", "questions", "hiring"]):
            reply = (
                f"Preparing for **{role}** interviews requires both solid theory and verifiable portfolio proof! 💼\n\n"
                f"**Top 3 Questions frequently asked:**\n"
                f"1. *Explain how gradient descent minimizes cost functions and the role of learning rate.*\n"
                f"2. *What is the difference between Precision and Recall, and when would you prioritize Recall?*\n"
                f"3. *Walk me through an end-to-end ML or software pipeline you've deployed and how you tested performance.*\n\n"
                f"Would you like a sample answer for any of these?"
            )
            suggestions = [
                "Explain Precision vs Recall",
                "Explain Gradient Descent",
                "Best portfolio projects"
            ]
            mood = "interview_prep"

        elif any(w in user_msg for w in ["precision", "recall"]):
            reply = (
                f"Here is the clean, intuitive breakdown: 🧠\n\n"
                f"• **Precision** = *Of all positive predictions made, how many were actually correct?*\n"
                f"  `Precision = TP / (TP + FP)`\n"
                f"  *(Crucial when false alarms are costly, like Spam filters)*\n\n"
                f"• **Recall** = *Of all actual positive cases in reality, how many did our model find?*\n"
                f"  `Recall = TP / (TP + FN)`\n"
                f"  *(Crucial when missing a case is dangerous, like medical diagnosis or fraud detection)*\n\n"
                f"• **F1-Score** is the harmonic mean: `2 * (Precision * Recall) / (Precision + Recall)`."
            )
            suggestions = [
                "Explain Gradient Descent",
                "What is ROC-AUC?",
                "What should I study next?"
            ]
            mood = "smart"

        elif any(w in user_msg for w in ["motivat", "tired", "hard", "encourage", "boost", "inspire"]):
            quotes = [
                f"Every senior engineer was once a beginner debugging their first syntax error! You're already at {score}%—take it one milestone at a time! 🌟",
                f"Consistency beats intensity! Even 30 minutes of hands-on coding today builds muscle memory that will pay off for years! 🚀",
                f"You're mastering real skills demanded by top employers. You've got this! Let's conquer this next milestone! 💪"
            ]
            reply = random.choice(quotes)
            suggestions = [
                "What should I study next?",
                "Give me a fun coding fact",
                "Interview preparation"
            ]
            mood = "cheering"

        elif any(w in user_msg for w in ["fact", "fun", "joke"]):
            facts = [
                "Did you know? The term 'debugging' originated in 1947 when Grace Hopper removed an actual moth from a Harvard Mark II computer relay! 🦋💻",
                "Python was named after the British comedy troupe Monty Python, not the snake! 🐍🎪",
                "In 2012, AlexNet won ImageNet by a landslide using two GPUs—kicking off the modern deep learning revolution! ⚡"
            ]
            reply = random.choice(facts)
            suggestions = [
                "How do I close my skill gaps?",
                "What should I study next?",
                "Give me a motivation boost!"
            ]
            mood = "playful"

        else:
            reply = (
                f"I'm here with you! For **{role}**, your top priority is mastering **{top_gap}**. 🚀\n\n"
                f"You can ask me anything about your roadmap, coding concepts, or interview questions in **English**, **اردو**, or **Roman Urdu**!"
            )
            suggestions = [
                f"How to learn {top_gap}?",
                "Explain my readiness score",
                "Interview questions"
            ]
            mood = "friendly"

    return ChatResponse(
        reply=reply,
        suggestions=suggestions,
        mood=mood,
        language=lang
    )
