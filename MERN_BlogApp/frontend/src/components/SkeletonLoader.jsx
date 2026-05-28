import React from 'react';

export const CardSkeleton = () => (
  <div className="border-b border-saas-border pb-8 mb-8 animate-fade-in">
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 space-y-3 w-full">
        <div className="skeleton h-4 w-1/4" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="flex gap-4 pt-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="skeleton w-full md:w-44 h-28 shrink-0" />
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
    <div className="skeleton h-4 w-20" />
    <div className="skeleton h-12 w-full" />
    <div className="skeleton h-12 w-2/3" />
    <div className="flex items-center gap-3 border-y border-saas-border py-4 my-8">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
    <div className="skeleton h-64 w-full" />
    <div className="space-y-4 pt-4">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  </div>
);