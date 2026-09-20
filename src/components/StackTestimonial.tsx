import { useState, useEffect, type FC } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import type { TestimonialItem } from '@types';

interface StackTestimonialProps {
  testimonials: readonly TestimonialItem[];
}

export const StackTestimonial: FC<StackTestimonialProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance with generous 7.5s reading time, pauses when hovered or touched
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7500);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 300;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrevious();
    }
  };

  return (
    <div
      className="stack-testi-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Interactive Draggable Stack Area */}
      <div className="stack-deck-container">
        {testimonials.map((item, index) => {
          const position = (index - activeIndex + testimonials.length) % testimonials.length;
          const isActive = position === 0;
          const isVisible = position < 3;

          return (
            <motion.div
              key={item.name + index}
              className={`stack-card-motion ${isActive ? 'is-active' : ''}`}
              initial={false}
              animate={{
                scale: isActive ? 1 : position === 1 ? 0.96 : position === 2 ? 0.92 : 0.88,
                y: isActive ? 0 : position === 1 ? 16 : position === 2 ? 32 : 48,
                x: isActive ? 0 : position === 1 ? 0 : 2,
                rotate: isActive ? 0 : position === 1 ? -1.2 : position === 2 ? 1.2 : 0,
                opacity: isVisible ? (isActive ? 1 : position === 1 ? 0.88 : 0.55) : 0,
                zIndex: testimonials.length - position,
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.45}
              onDragEnd={handleDragEnd}
              whileDrag={{
                scale: 1.015,
                cursor: 'grabbing',
              }}
            >
              <div
                className={`stack-card-inner ${
                  isActive
                    ? 'card-level-0'
                    : position === 1
                    ? 'card-level-1'
                    : 'card-level-2'
                }`}
              >
                {/* Header: Client Info & Star Rating */}
                <div className="stack-card-header">
                  <div className="stack-client-meta">
                    <div className="stack-avatar-wrap">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="stack-avatar-img"
                        loading="lazy"
                        width="52"
                        height="52"
                      />
                      <span className="stack-verified-badge" title="Klien Terverifikasi Bina Project">
                        <CheckCircle2 size={13} color="#FFFFFF" strokeWidth={3} />
                      </span>
                    </div>
                    <div className="stack-client-titles">
                      <h3 className="stack-client-name">{item.name}</h3>
                      <p className="stack-client-role">{item.role}</p>
                      {item.project && (
                        <span className="stack-project-tag">{item.project}</span>
                      )}
                    </div>
                  </div>

                  <div className="stack-rating-box">
                    <div className="stack-stars-row">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="stack-rating-score">5.0</span>
                  </div>
                </div>

                {/* Body: Quote Text with Architectural Quote Icon */}
                <div className="stack-card-body">
                  <Quote size={24} className="stack-quote-watermark" />
                  <p className="stack-quote-text">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls: Previous / Dynamic Pagination Pills / Next */}
      <div className="stack-controls-bar">
        <button
          type="button"
          onClick={handlePrevious}
          className="stack-nav-btn prev-btn"
          aria-label="Review Sebelumnya"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          <span className="btn-label-text">Sebelumnya</span>
        </button>

        <div className="stack-pagination-pills" role="tablist" aria-label="Pilih Review Klien">
          {testimonials.map((item, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              onClick={() => setActiveIndex(index)}
              className={`stack-page-pill ${index === activeIndex ? 'is-active' : ''}`}
              aria-label={`Lihat ulasan ${item.name}`}
              aria-selected={index === activeIndex}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="stack-nav-btn next-btn"
          aria-label="Review Berikutnya"
        >
          <span className="btn-label-text">Berikutnya</span>
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        /* ========================================================
           Stack Testimonial - The Draggable Card Deck
           Strictly using #22416D (Bina Navy) Design System
           ======================================================== */
        .stack-testi-wrapper {
          position: relative;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 10px 0 20px;
          user-select: none;
        }

        /* Deck Height Box */
        .stack-deck-container {
          position: relative;
          width: 100%;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Absolute Motion Card Position */
        .stack-card-motion {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          cursor: grab;
          touch-action: pan-y;
        }

        .stack-card-motion:active {
          cursor: grabbing;
        }

        /* Card Surfaces (Frameless & Elegant) */
        .stack-card-inner {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 34px 38px;
          position: relative;
          transition: background-color 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, box-shadow;
        }

        .card-level-0 {
          background: #FFFFFF;
          border: none;
          box-shadow:
            0 20px 45px rgba(34, 65, 109, 0.09),
            0 4px 14px rgba(0, 0, 0, 0.03);
        }

        .card-level-1 {
          background: #F8FAFC;
          border: none;
          box-shadow:
            0 14px 30px rgba(34, 65, 109, 0.06),
            0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .card-level-2 {
          background: #F1F5F9;
          border: none;
          box-shadow:
            0 8px 20px rgba(34, 65, 109, 0.04);
        }

        /* Header Area */
        .stack-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
        }

        .stack-client-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stack-avatar-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
        }

        .stack-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(34, 65, 109, 0.12);
          background: #E2E8F0;
        }

        .stack-verified-badge {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 18px;
          height: 18px;
          background: #22416D;
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stack-client-titles {
          display: flex;
          flex-direction: column;
        }

        .stack-client-name {
          font-family: var(--font-heading, 'Archivo', sans-serif);
          font-size: 16px;
          font-weight: 700;
          color: #17202A;
          margin: 0 0 2px;
          line-height: 1.3;
        }

        .stack-client-role {
          font-size: 13px;
          color: #475569;
          font-weight: 600;
          margin: 0 0 5px;
        }

        .stack-project-tag {
          align-self: flex-start;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #22416D;
          background: #EFF6FF;
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Star Rating Box */
        .stack-rating-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bina-rating-bg, #FEF3C7);
          padding: 6px 12px;
          border-radius: 9999px;
          flex-shrink: 0;
        }

        .stack-stars-row {
          display: flex;
          gap: 2px;
        }

        .stack-rating-score {
          font-size: 12px;
          font-weight: 700;
          color: var(--bina-rating-text, #92400E);
        }

        /* Body Quote */
        .stack-card-body {
          position: relative;
          padding: 4px 0 6px;
        }

        .stack-quote-watermark {
          position: absolute;
          top: -10px;
          left: -4px;
          color: rgba(34, 65, 109, 0.08);
          pointer-events: none;
        }

        .stack-quote-text {
          font-family: var(--font-body, 'Archivo', sans-serif);
          font-size: 17px;
          font-style: italic;
          line-height: 1.7;
          color: #1E293B;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* Navigation Controls Bar */
        .stack-controls-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 36px;
        }

        .stack-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #22416D;
          color: #FFFFFF;
          border: none;
          outline: none;
          min-height: 48px;
          padding: 12px 20px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(34, 65, 109, 0.22);
        }

        .stack-nav-btn:hover {
          background: var(--bina-navy-hover, #1B3457);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(34, 65, 109, 0.32);
        }

        .stack-nav-btn:active {
          transform: translateY(0);
        }

        /* Pagination Pills with 48px Interactive Hit Target */
        .stack-pagination-pills {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stack-page-pill {
          height: 48px;
          min-height: 48px;
          min-width: 20px;
          padding: 0 4px;
          border: none;
          outline: none;
          cursor: pointer;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stack-page-pill::before {
          content: '';
          display: block;
          height: 8px;
          width: 8px;
          border-radius: 9999px;
          background: #CBD5E1;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stack-page-pill.is-active::before {
          width: 32px;
          background: #22416D;
          box-shadow: 0 2px 8px rgba(34, 65, 109, 0.25);
        }

        .stack-page-pill:hover:not(.is-active)::before {
          background: #475569;
        }

        /* ========================================================
           Mobile Responsive
           ======================================================== */
        @media (max-width: 640px) {
          .stack-deck-container {
            min-height: 440px;
          }

          .stack-card-inner {
            padding: 24px 22px;
            border-radius: 20px;
          }

          .stack-quote-text {
            font-size: 15px;
            line-height: 1.6;
          }

          .stack-card-header {
            flex-direction: column;
            gap: 12px;
          }

          .stack-rating-box {
            align-self: flex-start;
          }

          .btn-label-text {
            display: none;
          }

          .stack-nav-btn {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};
