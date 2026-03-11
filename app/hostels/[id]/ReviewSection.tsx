"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { hostelsApi } from "@/lib/api/hostels";
import { Button } from "@/components/ui";
import type { Review } from "@/lib/types";

interface ReviewSectionProps {
  hostelId: string;
  initialReviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewSection({
  hostelId,
  initialReviews,
  rating,
  reviewCount,
}: ReviewSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentRating, setCurrentRating] = useState(rating);
  const [currentCount, setCurrentCount] = useState(reviewCount);

  // Review form state
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [hasCompletedStay, setHasCompletedStay] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    hostelsApi
      .reviewEligibility(hostelId)
      .then((res) => {
        setCanReview(res.data.canReview);
        setAlreadyReviewed(res.data.alreadyReviewed);
        setHasCompletedStay(res.data.hasCompletedStay);
      })
      .catch(() => {});
  }, [isAuthenticated, hostelId]);

  const handleSubmit = async () => {
    if (formRating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await hostelsApi.addReview(hostelId, {
        rating: formRating,
        comment: comment.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      const newCount = currentCount + 1;
      const newRating =
        (currentRating * currentCount + formRating) / newCount;
      setCurrentCount(newCount);
      setCurrentRating(Math.round(newRating * 10) / 10);
      setCanReview(false);
      setAlreadyReviewed(true);
      setShowForm(false);
      setFormRating(0);
      setComment("");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-9 border-t border-zinc-100 pt-9">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">Guest Reviews</h2>
          {currentCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {currentRating} · {currentCount} review
              {currentCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Write Review button */}
        {canReview && !showForm && (
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Eligibility message for logged-in users */}
      {isAuthenticated && !canReview && !alreadyReviewed && (
        <p className="mt-3 text-xs text-zinc-400">
          {hasCompletedStay
            ? ""
            : "You can review this hostel after your stay is complete."}
        </p>
      )}
      {isAuthenticated && alreadyReviewed && (
        <p className="mt-3 text-xs text-emerald-600 font-medium">
          ✓ You&apos;ve already reviewed this hostel
        </p>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
          <h3 className="text-sm font-semibold text-zinc-900">
            Share your experience
          </h3>

          {/* Star rating input */}
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setFormRating(star)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= (hoverRating || formRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-zinc-200 text-zinc-200"
                  }`}
                />
              </button>
            ))}
            {formRating > 0 && (
              <span className="ml-2 text-sm font-medium text-zinc-600">
                {formRating === 1
                  ? "Poor"
                  : formRating === 2
                    ? "Fair"
                    : formRating === 3
                      ? "Good"
                      : formRating === 4
                        ? "Very Good"
                        : "Excellent"}
              </span>
            )}
          </div>

          {/* Comment textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your stay? Tell others about your experience..."
            rows={3}
            className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Review
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setFormRating(0);
                setComment("");
                setError("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium text-zinc-500">
            No reviews yet
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {/* Rating summary */}
          <div className="rounded-xl bg-zinc-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(currentRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-zinc-200 text-zinc-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-zinc-600">
                {currentRating.toFixed(1)} out of 5
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Based on {currentCount} review{currentCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Individual review cards */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-zinc-100 bg-white p-5 transition-colors hover:border-zinc-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.user.avatarUrl ? (
                    <img
                      src={review.user.avatarUrl}
                      alt={review.user.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                      <UserIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {review.user.fullName}
                      {user?.id === review.user.id && (
                        <span className="ml-1.5 text-xs font-normal text-emerald-600">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-zinc-200 text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
