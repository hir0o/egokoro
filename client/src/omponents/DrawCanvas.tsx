import React from 'react'
import { Stage, Layer, Line } from 'react-konva'
import Konva from 'konva'
import { LineType } from '../types'

const DrawCanvas = () => {
  const [tool, setTool] = React.useState('pen')
  const [size, setSize] = React.useState(5)
  const [color, setColor] = React.useState('#000000')
  const [lines, setLines] = React.useState<LineType[]>([])
  const isDrawing = React.useRef(false)

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log('mouse')

    isDrawing.current = true
    const stage = e.currentTarget as Konva.Stage
    const { x, y } = stage.getPointerPosition() as Konva.Vector2d
    setLines((prev) => [
      ...prev,
      {
        tool,
        points: [x, y],
        color,
        size
      }
    ])
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const stage = e.currentTarget as Konva.Stage
    const { x, y } = stage.getPointerPosition() as Konva.Vector2d
    let lastLine = lines[lines.length - 1]
    lastLine.points = lastLine.points.concat([x, y]) as [number, number]
    lines.splice(lines.length - 1, 1, lastLine)
    setLines(lines.concat())
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const style = {
    backgroundColor: '#ffffff',
    width: '303px',
    height: '303px'
  }

  return (
    <>
      <div className="flex">
        <select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value)
          }}
        >
          <option value="pen">ペン</option>
          <option value="eraser">消しゴム</option>
        </select>
        <select
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value))
          }}
        >
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className="flex">
        <div style={style}>
          <Stage
            width={300}
            height={300}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            style={{
              border: 'solid',
              marginTop: '10px'
            }}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value)
          }}
        />
      </div>
    </>
  )
}
export default DrawCanvas
