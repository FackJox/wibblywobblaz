"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { css, cx } from "@/styled-system/css"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cx(
          css({
            display: "flex",
            aspectRatio: "16/9",
            justifyContent: "center",
            fontSize: "0.75rem",
            // Recharts specific styles - using arbitrary selectors
            '& .recharts-cartesian-axis-tick text': {
              fill: 'token(colors.muted.foreground)'
            },
            '& .recharts-cartesian-grid line[stroke="#ccc"]': {
              stroke: 'token(colors.border)',
              opacity: '0.5'
            },
            '& .recharts-curve.recharts-tooltip-cursor': {
              stroke: 'token(colors.border)'
            },
            '& .recharts-dot[stroke="#fff"]': {
              stroke: 'transparent'
            },
            '& .recharts-layer': {
              outline: 'none'
            },
            '& .recharts-polar-grid [stroke="#ccc"]': {
              stroke: 'token(colors.border)'
            },
            '& .recharts-radial-bar-background-sector': {
              fill: 'token(colors.muted)'
            },
            '& .recharts-rectangle.recharts-tooltip-cursor': {
              fill: 'token(colors.muted)'
            },
            '& .recharts-reference-line [stroke="#ccc"]': {
              stroke: 'token(colors.border)'
            },
            '& .recharts-sector[stroke="#fff"]': {
              stroke: 'transparent'
            },
            '& .recharts-sector': {
              outline: 'none'
            },
            '& .recharts-surface': {
              outline: 'none'
            }
          }),
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cx(css({ fontWeight: "500" }), labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cx(css({ fontWeight: "500" }), labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cx(
          css({
            display: "grid",
            minWidth: "8rem",
            alignItems: "start",
            gap: "0.375rem",
            borderRadius: "0.5rem",
            border: "1px solid",
            borderColor: "border",
            opacity: "0.5",
            backgroundColor: "background",
            paddingX: "0.625rem",
            paddingY: "0.375rem",
            fontSize: "0.75rem",
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
          }),
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className={css({ display: "grid", gap: "0.375rem" })}>
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cx(
                  css({
                    display: "flex",
                    width: "100%",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: "0.5rem",
                    '& > svg': {
                      height: "0.625rem",
                      width: "0.625rem",
                      color: "muted.foreground"
                    }
                  }),
                  indicator === "dot" && css({ alignItems: "center" })
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cx(
                            css({
                              flexShrink: 0,
                              borderRadius: "2px",
                              borderColor: "var(--color-border)",
                              backgroundColor: "var(--color-bg)"
                            }),
                            indicator === "dot" && css({ height: "0.625rem", width: "0.625rem" }),
                            indicator === "line" && css({ width: "0.25rem" }),
                            indicator === "dashed" && css({
                              width: "0",
                              borderWidth: "1.5px",
                              borderStyle: "dashed",
                              backgroundColor: "transparent"
                            }),
                            nestLabel && indicator === "dashed" && css({ marginY: "0.125rem" })
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cx(
                        css({
                          display: "flex",
                          flex: "1",
                          justifyContent: "space-between",
                          lineHeight: "1"
                        }),
                        nestLabel ? css({ alignItems: "end" }) : css({ alignItems: "center" })
                      )}
                    >
                      <div className={css({ display: "grid", gap: "0.375rem" })}>
                        {nestLabel ? tooltipLabel : null}
                        <span className={css({ color: "muted.foreground" })}>
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className={css({ fontFamily: "mono", fontWeight: "500", fontVariantNumeric: "tabular-nums", color: "foreground" })}>
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cx(
          css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem"
          }),
          verticalAlign === "top" ? css({ paddingBottom: "0.75rem" }) : css({ paddingTop: "0.75rem" }),
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                '& > svg': {
                  height: "0.75rem",
                  width: "0.75rem",
                  color: "muted.foreground"
                }
              })}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className={css({ height: "0.5rem", width: "0.5rem", flexShrink: 0, borderRadius: "2px" })}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
