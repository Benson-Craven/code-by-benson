import assert from "node:assert/strict"
import test from "node:test"
import {
    portfolioProjectSlugs,
    validatePortfolio,
    type PortfolioProject,
    type PortfolioProjectSlug,
    type ProjectStatus,
} from "../app/data/portfolio"

const projectTitles: Record<PortfolioProjectSlug, string> = {
    "chronic-pain-recovery": "Chronic Pain Recovery",
    "nibbles-with-nifa": "Nibbles with Nifa",
    waxlist: "Waxlist",
}

const projectStatuses: Record<PortfolioProjectSlug, ProjectStatus> = {
    "chronic-pain-recovery": "production",
    "nibbles-with-nifa": "published",
    waxlist: "unpublished",
}

const projectAvailabilityLabels: Record<PortfolioProjectSlug, string> = {
    "chronic-pain-recovery": "Live production site",
    "nibbles-with-nifa": "Published live site",
    waxlist: "Development phase",
}

const projectLiveSites: Partial<
    Record<PortfolioProjectSlug, `https://${string}`>
> = {
    "chronic-pain-recovery": "https://chronicpainrecovery.ie",
    "nibbles-with-nifa": "https://nibbles-with-nifa.vercel.app/",
}

function createProject(
    slug: PortfolioProjectSlug,
    order: number,
): PortfolioProject {
    const title = projectTitles[slug]
    const decisionIds = ["structure", "boundary", "delivery"] as const
    const stillIds = ["overview", "detail", "workflow"] as const
    const liveSite = projectLiveSites[slug]

    return {
        slug,
        order,
        title,
        summary: `${title} contract test summary.`,
        status: projectStatuses[slug],
        availabilityLabel: projectAvailabilityLabels[slug],
        timeframe: "Verified timeframe",
        stack: ["TypeScript"],
        capabilities: [
            {
                label: "Frontend engineering",
                evidence: [
                    { kind: "decision", id: decisionIds[0] },
                    { kind: "media", id: stillIds[0] },
                ],
            },
        ],
        ownership: {
            role: "Frontend engineering",
            responsibilities: ["Verified responsibility"],
            boundaries: ["No additional ownership is claimed."],
            collaborators:
                slug === "nibbles-with-nifa"
                    ? [
                          {
                              name: "Nifa",
                              role: "Editorial direction and creator work",
                          },
                      ]
                    : [],
        },
        actions: [
            {
                kind: "case-study",
                label: "Read case study",
                href: `/work/${slug}`,
            },
            ...(liveSite === undefined
                ? []
                : [
                      {
                          kind: "live-site" as const,
                          label: "Visit live site",
                          href: liveSite,
                      },
                  ]),
        ],
        cover: {
            src: `/test/${slug}-cover.avif`,
            alt: `${title} interface overview`,
            decorative: false,
            width: 1600,
            height: 1000,
        },
        caseStudy: {
            context: ["Verified context"],
            constraints: ["Verified constraint"],
            decisions: decisionIds.map((id, index) => ({
                id,
                title: `Decision ${index + 1}`,
                tradeoff: "Verified trade-off",
                approach: "Verified approach",
                rationale: "Verified rationale",
                evidence: { kind: "media", id: stillIds[index] },
            })) as PortfolioProject["caseStudy"]["decisions"],
            proof: "Evidence is described beside each decision.",
            outcomes: ["Verified qualitative outcome"],
            reflection: ["Verified reflection"],
        },
        evidence: {
            stills: stillIds.map((id, index) => ({
                kind: "image" as const,
                id,
                src: `/test/${slug}-${index + 1}.avif`,
                alt: `${title} evidence view ${index + 1}`,
                decorative: false as const,
                caption: `Evidence view ${index + 1}`,
                width: 1600,
                height: 1000,
            })) as PortfolioProject["evidence"]["stills"],
            clip: {
                kind: "video",
                id: "interaction",
                src: `/test/${slug}.webm`,
                poster: `/test/${slug}-poster.avif`,
                caption: `${title} interaction`,
                description:
                    "A text description of the demonstrated interaction.",
                captionsSrc: `/test/${slug}.vtt`,
                preload: "none",
                controls: true,
                playsInline: true,
                muted: true,
                autoPlay: false,
            },
        },
        seo: {
            title: `${title} case study`,
            description: `${title} search description.`,
            shareImage: {
                src: `/test/${slug}-share.avif`,
                alt: `${title} case study by Benson Craven`,
                decorative: false,
                width: 1200,
                height: 630,
            },
        },
        updatedAt: "2026-07-14",
    }
}

function createPortfolio(): PortfolioProject[] {
    return portfolioProjectSlugs.map((slug, index) =>
        createProject(slug, index + 1),
    )
}

function expectValidationError(
    mutate: (portfolio: PortfolioProject[]) => void,
    expected: RegExp,
) {
    const portfolio = createPortfolio()
    mutate(portfolio)

    assert.match(validatePortfolio(portfolio).join("\n"), expected)
}

test("accepts a complete portfolio in the approved public order", () => {
    assert.deepEqual(validatePortfolio(createPortfolio()), [])
})

test("rejects duplicate, unknown, or out-of-order public slugs", async (t) => {
    await t.test("duplicate slug", () => {
        expectValidationError((portfolio) => {
            portfolio[1].slug = portfolio[0].slug
        }, /duplicate slug/i)
    })

    await t.test("unknown slug", () => {
        expectValidationError((portfolio) => {
            portfolio[1].slug = "unknown-project" as PortfolioProjectSlug
        }, /unknown slug/i)
    })

    await t.test("wrong order", () => {
        expectValidationError((portfolio) => {
            ;[portfolio[0], portfolio[1]] = [portfolio[1], portfolio[0]]
        }, /approved order/i)
    })
})

test("rejects public placeholder copy and invalid actions", async (t) => {
    await t.test("placeholder copy", () => {
        expectValidationError((portfolio) => {
            portfolio[0].summary = "CASE STUDY PLACEHOLDER"
        }, /placeholder copy/i)
    })

    await t.test("hash destination", () => {
        expectValidationError((portfolio) => {
            portfolio[0].actions[0].href = "#" as never
        }, /invalid action/i)
    })

    await t.test("generic GitHub profile used as source", () => {
        expectValidationError((portfolio) => {
            portfolio[0].actions.push({
                kind: "source",
                label: "View source",
                href: "https://github.com/Benson-Craven",
            })
        }, /unapproved or unrelated source/i)
    })

    await t.test("unrelated live deployment", () => {
        expectValidationError((portfolio) => {
            const liveSite = portfolio[0].actions.find(
                ({ kind }) => kind === "live-site",
            )

            if (liveSite?.kind === "live-site") {
                liveSite.href = "https://example.com/chronic-pain-recovery"
            }
        }, /unapproved or unrelated live-site/i)
    })
})

test("rejects missing project availability copy", () => {
    expectValidationError((portfolio) => {
        portfolio[0].availabilityLabel = ""
    }, /availability/i)
})

test("rejects availability copy that contradicts approved project state", () => {
    expectValidationError((portfolio) => {
        portfolio[2].availabilityLabel = "Live production site"
    }, /approved availability/i)
})

test("rejects missing evidence or SEO metadata", async (t) => {
    await t.test("missing evidence still", () => {
        expectValidationError((portfolio) => {
            portfolio[0].evidence.stills = portfolio[0].evidence.stills.slice(
                0,
                2,
            ) as never
        }, /exactly three evidence stills/i)
    })

    await t.test("missing metadata", () => {
        expectValidationError((portfolio) => {
            portfolio[0].seo.title = ""
        }, /missing SEO metadata/i)
    })
})

test("rejects contradictory unpublished project actions", () => {
    expectValidationError((portfolio) => {
        portfolio[2].actions.push({
            kind: "live-site",
            label: "Visit live site",
            href: "https://example.com/waxlist",
        })
    }, /unpublished projects cannot link to a live site or public source/i)
})

test("rejects publication statuses that contradict the approved project state", async (t) => {
    await t.test("Chronic Pain Recovery must remain production", () => {
        expectValidationError((portfolio) => {
            portfolio[0].status = "published"
        }, /must use the approved production status/i)
    })

    await t.test("Nibbles must be release-ready before it is public", () => {
        expectValidationError((portfolio) => {
            portfolio[1].status = "unpublished"
        }, /must use the approved published status/i)
    })
})

test("allows decorative project imagery to use empty alternative text", () => {
    const portfolio = createPortfolio()
    portfolio[0].cover = {
        ...portfolio[0].cover,
        decorative: true,
        alt: "",
    }

    assert.deepEqual(validatePortfolio(portfolio), [])
})

test("rejects capability evidence that cannot be resolved", () => {
    expectValidationError((portfolio) => {
        portfolio[0].capabilities[0].evidence = [
            { kind: "decision", id: "missing-decision" },
        ]
    }, /unresolved evidence/i)
})

test("rejects a project without an explicit ownership boundary", () => {
    expectValidationError((portfolio) => {
        portfolio[0].ownership.boundaries = []
    }, /ownership boundary/i)
})
