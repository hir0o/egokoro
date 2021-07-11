import React, {
  Dispatch,
  VFC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Stage, Layer, Line } from 'react-konva'
import Konva from 'konva'
import { LineType } from '../../types'
import { socketEmit, socketOn } from '../../utils/socket'
import { SocketContext, UserContext } from '../../App'
import Select from './Select'
import styled from 'styled-components'

const canvasSize = {
  width: 600,
  height: 400
}

type PropsType = {
  lines: LineType[]
  setLines: Dispatch<SetStateAction<LineType[]>>
  imageData: string
  setImageData: Dispatch<SetStateAction<string>>
}

const DrawCanvas: VFC<PropsType> = ({
  lines,
  setLines,
  imageData,
  setImageData
}) => {
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [size, setSize] = useState(5)
  const [color, setColor] = useState('#000000')

  const isDrawing = useRef(false)
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
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
    socketEmit(socket, 'start', {
      tool,
      points: [x, y],
      color,
      size
    })
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const stage = e.currentTarget as Konva.Stage
    const { x, y } = stage.getPointerPosition() as Konva.Vector2d
    const lastLine = lines[lines.length - 1]
    lastLine.points = lastLine.points.concat([x, y]) as [number, number]
    lines.splice(lines.length - 1, 1, lastLine)
    setLines(lines.concat())

    socketEmit(socket, 'move', {
      x,
      y
    })
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    socketEmit(socket, 'end', '')
  }

  useEffect(() => {
    socketOn(socket, 'start', (payload: { data: string }) => {
      // console.log('start: ', payload.data)
      setImageData(payload.data)
    })

    socketOn(socket, 'move', (payload: { data: string }) => {
      // console.log('move: ', payload.data)
      setImageData(payload.data)
    })

    socketOn(socket, 'end', (payload: { data: string }) => {
      // console.log('end: ', payload.data)

      setImageData(payload.data)
    })
  }, [])

  return (
    <>
      {user.state === 'draw' ? (
        <StyledDrawCanvas>
          <div className="draw-canvas__inner">
            <Select
              value={tool}
              className="draw-canvas__input"
              onChange={(e) => {
                setTool(e.target.value as 'pen' | 'eraser')
              }}
              items={[
                { value: 'pen', name: 'ペン' },
                { value: 'eraser', name: '消しゴム' }
              ]}
            />
            <Select
              value={size}
              className="draw-canvas__input"
              onChange={(e) => {
                setSize(Number(e.target.value))
              }}
              items={[
                { value: '3', name: '3' },
                { value: '5', name: '5' },
                { value: '10', name: '10' },
                { value: '15', name: '15' },
                { value: '20', name: '20' }
              ]}
            />
            <input
              type="color"
              value={color}
              className="draw-canvas__input"
              onChange={(e) => {
                setColor(e.target.value)
              }}
            />
          </div>
          <div className="draw-canvas__canvas">
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              className="draw-canvas__stage"
            >
              <Layer>
                {lines.map(({ points, color, size, tool }, i) => (
                  <Line
                    key={i}
                    points={points}
                    stroke={color}
                    strokeWidth={size}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={
                      tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </StyledDrawCanvas>
      ) : (
        <StyledImageConteiner>
          <img src={imageData} className="image-container__item" alt="" />
        </StyledImageConteiner>
      )}
    </>
  )
}

const StyledDrawCanvas = styled.div`
  border: 1px solid #333333;
  @media (max-width: 468px) {
    margin-left: auto;
    margin-right: auto;
  }
  .draw-canvas__inner {
    display: flex;
    border-bottom: 1px solid #333333;
    padding: 0.75rem;
  }
  .draw-canvas__input {
    border: 1px solid #333333;
  }
  .draw-canvas__input + .draw-canvas__input {
    margin-left: 0.5rem;
  }
  .draw-canvas__stage {
    margin-top: 0.75rem;
  }
  .draw-canvas__canvas {
    width: ${canvasSize.width}px;
    height: ${canvasSize.height}px;
    border: 1px solid #333333;
    margin-left: auto;
    margin-right: auto;
  }
`

const StyledImageConteiner = styled.div`
  text-align: center;
  .image-container__item {
    width: ${canvasSize.width}px;
    height: ${canvasSize.height}px;
    border: 1px solid #333333;
  }
`

export default DrawCanvas
