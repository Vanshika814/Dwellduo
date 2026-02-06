# 🎬 Framer Motion Examples for DwellDuo

## Installation

```bash
cd frontend
npm install framer-motion
```

---

## ✨ **Example 1: Animated City Cards**

```jsx
import { motion } from "framer-motion";

// In your city cards section:
<div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 p-8">
  {cities.map((city, index) => (
    <motion.div
      key={city.name}
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1  // Stagger effect
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <img src={city.image} alt={city.name} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <motion.h2 
          className="text-xl font-bold text-white drop-shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {city.name}
        </motion.h2>
      </div>
    </motion.div>
  ))}
</div>
```

---

## ✨ **Example 2: Hero Section Animation**

```jsx
import { motion } from "framer-motion";

<motion.section 
  className="min-h-screen flex justify-center items-start px-4 py-24"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-5xl w-full grid gap-10 md:grid-cols-2 items-center py-28">
    {/* Text content */}
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.p 
        className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Dwell Duo
      </motion.p>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Find Your Perfect Roommate
      </motion.h1>
      
      <motion.p 
        className="text-sm md:text-base text-slate-600 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Smart matchmaking based on compatibility, lifestyle, and preferences.
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap gap-3 pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {/* Buttons */}
      </motion.div>
    </motion.div>
    
    {/* Illustration with bounce animation */}
    <motion.div 
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.4,
        type: "spring",
        bounce: 0.3
      }}
    >
      {/* Your gradient box */}
    </motion.div>
  </div>
</motion.section>
```

---

## ✨ **Example 3: Scroll-Triggered Animations**

```jsx
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  return (
    <>
      {/* Hero fades out as you scroll */}
      <motion.section style={{ opacity }}>
        {/* Hero content */}
      </motion.section>
      
      {/* Containers fade in when scrolling into view */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        {/* Container 2 */}
      </motion.div>
    </>
  );
}
```

---

## ✨ **Example 4: Button Hover Effects**

```jsx
<motion.button
  className="rounded-full bg-sky-500 px-6 py-2.5 text-white"
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  Get Started
</motion.button>
```

---

## ✨ **Example 5: Stagger Children Animation**

```jsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div 
  className="grid grid-cols-6 gap-10"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  {cities.map(city => (
    <motion.div key={city.name} variants={item}>
      {/* City card */}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 **Popular Animation Types**

### **1. Fade In**
```jsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

### **2. Slide Up**
```jsx
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
```

### **3. Scale Up**
```jsx
initial={{ scale: 0.8 }}
animate={{ scale: 1 }}
```

### **4. Rotate**
```jsx
initial={{ rotate: -10 }}
animate={{ rotate: 0 }}
```

### **5. Hover Scale**
```jsx
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
```

---

## 🎨 **Best Practices**

1. **Use `viewport={{ once: true }}`** - Animates only once when scrolling into view
2. **Add delays** - Use `delay: 0.2` for sequential animations
3. **Use `type: "spring"`** - For natural, bouncy animations
4. **Keep animations subtle** - 0.3-0.6s duration is usually perfect
5. **Test on mobile** - Ensure animations don't impact performance

---

## 📦 **Full Implementation Example**

See the next file for a complete Home.jsx with Framer Motion!

