"use client";

import { motion } from "framer-motion";
import { Portfolio } from "@/lib/mockData";

type CardSize = "large" | "medium" | "small" | "tiny";

interface Props {
  portfolio: Portfolio;
  onClick: (p: Portfolio) => void;
  index: number;
  size?: CardSize;
}

const SIZE_CONFIG = {
  large: {
    imageRatio: "68%",
    titleSize: 16,
    descSize: 13,
    metaSize: 12,
    badgeSize: 11,
    padding: "16px 18px 20px",
  },
  medium: {
    imageRatio: "54%",
    titleSize: 14,
    descSize: 12,
    metaSize: 11,
    badgeSize: 10,
    padding: "14px 16px 16px",
  },
  small: {
    imageRatio: "52%",
    titleSize: 13,
    descSize: 11,
    metaSize: 11,
    badgeSize: 10,
    padding: "12px 12px 14px",
  },
  tiny: {
    imageRatio: "36%",
    titleSize: 11,
    descSize: 10,
    metaSize: 10,
    badgeSize: 9,
    padding: "8px 10px 10px",
  },
};

export default function PortfolioCard({ portfolio, onClick, index, size = "medium" }: Props) {
  const cfg = SIZE_CONFIG[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(portfolio)}
      className={`card-glow portfolio-card-${size}`}
      style={{
        background: "linear-gradient(145deg, #1C1C1C, #151515)",
        border: "1px solid #2E2E2E",
        borderRadius: 2,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingTop: cfg.imageRatio, overflow: "hidden" }}>
        <img
          src={portfolio.imageUrl}
          alt={portfolio.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
          onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0A0A0Af0 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "3px 10px",
            background: "#0A0A0Acc",
            border: "1px solid #C9A84C70",
            color: "#C9A84C",
            fontSize: cfg.badgeSize,
            letterSpacing: "0.1em",
            fontFamily: "inherit",
          }}
        >
          {portfolio.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: cfg.padding }}>
        <div style={{ color: "#C9A84C", fontSize: cfg.metaSize, letterSpacing: "0.1em", marginBottom: 6, fontFamily: "inherit" }}>
          {portfolio.industry} · {portfolio.location}
        </div>
        <h3
          style={{
            color: "#F0EBE0",
            fontSize: cfg.titleSize,
            fontWeight: 600,
            marginBottom: 6,
            lineHeight: 1.45,
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {portfolio.title}
        </h3>
        <p
          style={{
            color: "#8A8A7A",
            fontSize: cfg.descSize,
            lineHeight: 1.6,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {portfolio.description}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, #C9A84C50, transparent)",
        }}
      />
    </motion.div>
  );
}
