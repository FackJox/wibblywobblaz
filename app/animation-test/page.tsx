"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { 
  fadeVariants, 
  slideVariants, 
  scaleVariants,
  staggerContainerVariants,
  staggerItemVariants,
  usePerformanceMonitor,
  useReducedMotion,
} from "@/lib/animations";

export default function AnimationTestPage() {
  const [showElements, setShowElements] = useState(true);
  const [animationType, setAnimationType] = useState<"fade" | "slide" | "scale">("fade");
  const prefersReducedMotion = useReducedMotion();
  
  const { metrics } = usePerformanceMonitor({
    enabled: true,
    onLowPerformance: (metrics) => {
      console.log("Low performance detected:", metrics);
    },
  });

  const getVariant = () => {
    switch (animationType) {
      case "slide":
        return slideVariants;
      case "scale":
        return scaleVariants;
      default:
        return fadeVariants;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Animation Infrastructure Test</h1>
          
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm">
              <strong>FPS:</strong> {metrics.fps} | 
              <strong> Frame Time:</strong> {metrics.frameTime}ms | 
              <strong> Dropped Frames:</strong> {metrics.droppedFrames}
            </p>
            <p className="text-sm">
              <strong>Prefers Reduced Motion:</strong> {prefersReducedMotion ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Animation Controls</h2>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setShowElements(!showElements)}
              variant="outline"
            >
              Toggle Elements
            </Button>
            
            <Button 
              onClick={() => setAnimationType("fade")}
              variant={animationType === "fade" ? "default" : "outline"}
            >
              Fade
            </Button>
            
            <Button 
              onClick={() => setAnimationType("slide")}
              variant={animationType === "slide" ? "default" : "outline"}
            >
              Slide
            </Button>
            
            <Button 
              onClick={() => setAnimationType("scale")}
              variant={animationType === "scale" ? "default" : "outline"}
            >
              Scale
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Animated Button Examples</h2>
          
          <div className="flex gap-4 flex-wrap">
            <AnimatedButton>
              Default Animation
            </AnimatedButton>
            
            <AnimatedButton animationDuration="slow">
              Slow Animation
            </AnimatedButton>
            
            <AnimatedButton animationDuration="instant">
              Instant Animation
            </AnimatedButton>
            
            <AnimatedButton variant="secondary">
              Secondary Variant
            </AnimatedButton>
            
            <AnimatedButton variant="destructive">
              Destructive Variant
            </AnimatedButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Animated Elements</h2>
          
          <AnimatePresence mode="wait">
            {showElements && (
              <motion.div
                key="animated-content"
                variants={getVariant()}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="p-6 bg-card rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Animated Card</h3>
                  <p className="text-muted-foreground">
                    This card appears with the selected animation type.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Staggered List Animation</h2>
          
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                variants={staggerItemVariants}
                className="p-4 bg-card rounded-lg shadow-sm"
              >
                <h4 className="font-medium">Item {item}</h4>
                <p className="text-sm text-muted-foreground">
                  Staggered animation item
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}