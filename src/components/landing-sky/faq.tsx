'use client';

import React, { useState } from 'react';

import { tk } from './parts';

const KEYS = ['iphone', 'bank_key', 'trap', 'cash', 'export', 'invest'] as const;

export function Faq(): React.ReactElement {
  const [open, setOpen] = useState(0);

  return (
    <div className="acordeon">
      {KEYS.map((key, index) => {
        const isOpen = open === index;
        return (
          <div key={key} className={`pregunta${isOpen ? ' abierta' : ''}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${key}`}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              <span>{tk(`landing_faq_${key}_q`)}</span>
              <i aria-hidden="true" />
            </button>
            {/* Always in the page, so the answers are there for a search engine
                and for a browser without JavaScript; `hidden` only closes it. */}
            <div id={`faq-${key}`} className="respuesta" hidden={!isOpen}>
              <p>{tk(`landing_faq_${key}_a`)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
