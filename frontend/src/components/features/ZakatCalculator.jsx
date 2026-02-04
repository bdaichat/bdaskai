import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, Info, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ZakatCalculator Component - Integrated for BdAsk
 * Islamic Zakat calculator for Bangladesh with Bengali support
 */

const ZakatCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cash: '',
    bankBalance: '',
    gold: '',
    silver: '',
    investments: '',
    businessAssets: '',
    debts: '',
    expenses: '',
  });
  const [result, setResult] = useState(null);

  // Nisab threshold (in BDT) - 2025 values
  const NISAB_GOLD = 525000;
  const NISAB_SILVER = 52500;
  const ZAKAT_RATE = 0.025;

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit =>
      digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit)] : digit
    ).join('');
  };

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('bn-BD').format(amount);
    return `৳${formatted}`;
  };

  const handleInputChange = (field, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, [field]: numericValue });
  };

  const calculateZakat = () => {
    const cash = parseInt(formData.cash) || 0;
    const bankBalance = parseInt(formData.bankBalance) || 0;
    const gold = parseInt(formData.gold) || 0;
    const silver = parseInt(formData.silver) || 0;
    const investments = parseInt(formData.investments) || 0;
    const businessAssets = parseInt(formData.businessAssets) || 0;
    const debts = parseInt(formData.debts) || 0;
    const expenses = parseInt(formData.expenses) || 0;

    const totalAssets = cash + bankBalance + gold + silver + investments + businessAssets;
    const netWealth = totalAssets - debts - expenses;
    const exceedsNisab = netWealth >= NISAB_SILVER;
    const zakatAmount = exceedsNisab ? Math.round(netWealth * ZAKAT_RATE) : 0;

    setResult({
      totalAssets,
      debts,
      expenses,
      netWealth,
      exceedsNisab,
      zakatAmount,
      nisabAmount: NISAB_SILVER,
    });

    setStep(3);
  };

  const resetCalculator = () => {
    setStep(1);
    setFormData({
      cash: '', bankBalance: '', gold: '', silver: '',
      investments: '', businessAssets: '', debts: '', expenses: '',
    });
    setResult(null);
  };

  // Step 1: Introduction
  if (step === 1) {
    return (
      <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="zakat-tab">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="icon-3d icon-3d-green w-20 h-20 mx-auto mb-4">
            <Calculator className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground bangla-display mb-2">যাকাত ক্যালকুলেটর</h1>
          <p className="text-muted-foreground bangla-body">ইসলামিক নিয়ম অনুযায়ী আপনার যাকাত হিসাব করুন</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 rounded-2xl mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground bangla-heading mb-1">যাকাত কী?</h3>
              <p className="text-sm text-muted-foreground bangla-body leading-relaxed">
                যাকাত হলো ইসলামের পাঁচটি স্তম্ভের একটি। নিসাব পরিমাণ সম্পদের উপর বছরে ২.৫% যাকাত ফরজ।
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-6"
        >
          <h3 className="text-lg font-semibold bangla-heading mb-4 text-center">নিসাব সীমা (২০২৫)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/20 text-center">
              <p className="text-sm opacity-90 mb-1 bangla-body">সোনা (৮৭.৪৮ গ্রাম)</p>
              <p className="text-xl font-bold">{formatCurrency(NISAB_GOLD)}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/20 text-center">
              <p className="text-sm opacity-90 mb-1 bangla-body">রূপা (৬১২.৩৬ গ্রাম)</p>
              <p className="text-xl font-bold">{formatCurrency(NISAB_SILVER)}</p>
            </div>
          </div>
          <p className="text-xs text-center mt-3 opacity-80 bangla-body">
            * সাধারণত রূপার মূল্য অনুযায়ী হিসাব করা হয়
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(2)}
          className="btn-primary py-4 rounded-2xl bangla-body text-lg flex items-center justify-center gap-2"
          data-testid="start-zakat-btn"
        >
          হিসাব শুরু করুন <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  // Step 2: Input Form
  if (step === 2) {
    const inputFields = [
      { section: '💰 তরল সম্পদ', fields: [
        { key: 'cash', label: 'নগদ টাকা (হাতে থাকা)', placeholder: '৫০০০০' },
        { key: 'bankBalance', label: 'ব্যাংক ব্যালেন্স', placeholder: '২০০০০০' },
      ]},
      { section: '💎 মূল্যবান ধাতু', fields: [
        { key: 'gold', label: 'সোনার মূল্য', placeholder: '১০০০০০' },
        { key: 'silver', label: 'রূপার মূল্য', placeholder: '২০০০০' },
      ]},
      { section: '📈 বিনিয়োগ', fields: [
        { key: 'investments', label: 'শেয়ার, সঞ্চয়পত্র ইত্যাদি', placeholder: '৫০০০০' },
        { key: 'businessAssets', label: 'ব্যবসায়িক সম্পদ', placeholder: '১০০০০০' },
      ]},
      { section: '➖ বাদ দিন', fields: [
        { key: 'debts', label: 'ঋণ (পরিশোধযোগ্য)', placeholder: '৩০০০০' },
        { key: 'expenses', label: 'জরুরি খরচ', placeholder: '১২০০০০' },
      ]},
    ];

    return (
      <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="zakat-form">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <h2 className="text-xl font-bold text-foreground bangla-heading text-center">সম্পদের তথ্য দিন</h2>
          <p className="text-sm text-muted-foreground text-center bangla-body">সব পরিমাণ টাকায় লিখুন</p>
        </motion.div>

        {inputFields.map((section, sIdx) => (
          <motion.div 
            key={sIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
            className="mb-5"
          >
            <h3 className="text-base font-semibold text-foreground bangla-heading mb-3 pb-2 border-b border-border/50">
              {section.section}
            </h3>
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-muted-foreground bangla-body mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="glass-input w-full"
                    data-testid={`zakat-input-${field.key}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="flex gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(1)}
            className="flex-1 py-3 rounded-xl btn-glass bangla-body flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> পিছনে
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateZakat}
            className="flex-1 py-3 rounded-xl btn-primary bangla-body"
            data-testid="calculate-zakat-btn"
          >
            হিসাব করুন
          </motion.button>
        </div>
      </div>
    );
  }

  // Step 3: Results
  if (step === 3 && result) {
    return (
      <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="zakat-result">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          {result.exceedsNisab ? (
            <>
              <div className="icon-3d icon-3d-green w-20 h-20 mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground bangla-heading mb-2">আপনার যাকাত</h2>
              <p className="text-4xl font-bold text-primary bangla-display mb-1">
                {formatCurrency(result.zakatAmount)}
              </p>
              <p className="text-muted-foreground bangla-body">নিট সম্পদের ২.৫%</p>
            </>
          ) : (
            <>
              <div className="icon-3d icon-3d-blue w-20 h-20 mx-auto mb-4">
                <Info className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground bangla-heading mb-2">যাকাত ফরজ নয়</h2>
              <p className="text-muted-foreground bangla-body">আপনার সম্পদ নিসাব সীমার নিচে</p>
            </>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 rounded-2xl mb-6"
        >
          <h3 className="text-lg font-semibold text-foreground bangla-heading mb-4 text-center">বিস্তারিত</h3>
          <div className="space-y-3">
            {[
              { label: 'মোট সম্পদ', value: formatCurrency(result.totalAssets) },
              { label: 'ঋণ', value: `- ${formatCurrency(result.debts)}` },
              { label: 'জরুরি খরচ', value: `- ${formatCurrency(result.expenses)}` },
              { label: 'নিট সম্পদ', value: formatCurrency(result.netWealth), bold: true },
              { label: 'নিসাব সীমা', value: formatCurrency(result.nisabAmount) },
            ].map((row, idx) => (
              <div key={idx} className={`flex justify-between py-2 ${row.bold ? 'border-t border-border pt-3 font-bold' : ''}`}>
                <span className="text-muted-foreground bangla-body">{row.label}</span>
                <span className={`${row.bold ? 'text-foreground' : 'text-foreground/80'} bangla-body`}>{row.value}</span>
              </div>
            ))}
            {result.exceedsNisab && (
              <div className="flex justify-between py-3 mt-2 px-4 -mx-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-b-xl">
                <span className="font-semibold bangla-body">যাকাত (২.৫%)</span>
                <span className="font-bold text-xl">{formatCurrency(result.zakatAmount)}</span>
              </div>
            )}
          </div>
        </motion.div>

        {result.exceedsNisab && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-6"
          >
            <h3 className="text-lg font-semibold bangla-heading mb-3">যাকাত কোথায় দিবেন?</h3>
            <ul className="space-y-2 bangla-body text-sm">
              {['গরিব-মিসকিন ও অসহায়দের', 'ইয়াতিম শিশুদের', 'বিধবা মহিলাদের', 'মাদ্রাসা ও এতিমখানায়'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(2)}
            className="flex-1 py-3 rounded-xl btn-glass bangla-body"
          >
            পিছনে
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetCalculator}
            className="flex-1 py-3 rounded-xl btn-primary bangla-body"
            data-testid="reset-zakat-btn"
          >
            নতুন হিসাব
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
};

export default ZakatCalculator;
