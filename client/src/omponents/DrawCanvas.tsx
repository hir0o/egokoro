import {
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
import { LineType } from '../types'
import { socketEmit, socketOn } from '../utils/socket'
import { SocketContext, UserContext } from '../App'

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

  const style = {
    width: '600px',
    height: '400px'
  }

  return (
    <>
      {user.state === 'draw' ? (
        <div className="border sm:mx-auto">
          <div className="flex border-b p-3">
            <select
              value={tool}
              className="border"
              onChange={(e) => {
                setTool(e.target.value as 'pen' | 'eraser')
              }}
            >
              <option value="pen">ペン</option>
              <option value="eraser">消しゴム</option>
            </select>
            <select
              value={size}
              className="border ml-2"
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
            <input
              type="color"
              value={color}
              className="border ml-2"
              onChange={(e) => {
                setColor(e.target.value)
              }}
            />
          </div>
          <div style={style}>
            <Stage
              width={600}
              height={400}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              style={{
                marginTop: 'mt-3'
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
        </div>
      ) : (
        <img src={imageData} style={style} className="border mx-auto" alt="" />
      )}
    </>
  )
}
export default DrawCanvas
