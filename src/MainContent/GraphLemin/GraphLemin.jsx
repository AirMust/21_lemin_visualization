import React, { useEffect, useRef, useContext } from 'react'
import { Stage, Layer, Circle, Text, Line } from 'react-konva'
import { blue, red, green, grey, brown } from '@material-ui/core/colors'
import Context from '../../boot/context'
const GraphLemin = ({
  step,
  setStep,
  state,
  setState,
  links,
  setLinks,
  ants,
  setAnts,
  countAnts,
  ...props
}) => {
  const typeColor = {
    '-1': [red[500], red[100]],
    '0': [blue[500], blue[100]],
    '1': [green[500], green[100]]
  }

  const [metaAnts, setMetaAnts] = React.useState({})
  const layRef = useRef()
  const [update, setUpdate] = React.useState(0)
  const { height } = useContext(Context)
  const { width } = useContext(Context)
  // useEffect(() => {
  //   if (step === -1) {
  //     let metaAntsTemp = {}
  //     let refs = {}
  //     setMetaAnts({})
  //     const startNode = Object.keys(state).filter(
  //       obj => state[obj].type === -1
  //     )[0]
  //     let i = 0
  //     while (++i <= countAnts) {
  //       metaAntsTemp['L' + i] = { ...state[startNode], cur: startNode }
  //       const antMeta = layRef.current.children.filter(
  //         obj => obj.name() === 'L' + i + '_circle'
  //       )
  //       const antTextMeta = layRef.current.children.filter(
  //         obj => obj.name() === 'L' + i + '_text'
  //       )
  //       if (antMeta.length) antMeta[0].destroy()
  //       if (antTextMeta.length) antTextMeta[0].destroy()
  //     }
  //     console.log(metaAntsTemp)
  //     setUpdate(update + 1)
  //     setMetaAnts(metaAntsTemp)
  //   } else if (step < ants.length && step > -1) {
  //     const childrenLay = layRef.current.children
  //     ants[step].map(way => {
  //       const [nameAnt, nameNode] = way.split('-')
  //       const antMeta = childrenLay.filter(
  //         obj => obj.name() === nameAnt + '_circle'
  //       )[0]
  //       console.log(antMeta, childrenLay, nameAnt)
  //       antMeta.to({
  //         // zIndex: 1,
  //         x: state[nameNode].x,
  //         y: state[nameNode].y,
  //         duration: 0.5
  //       })
  //       const antTextMeta = childrenLay.filter(
  //         obj => obj.name() === nameAnt + '_text'
  //       )[0]
  //       antTextMeta.to({
  //         // zIndex: 1,
  //         x: state[nameNode].x - 5,
  //         y: state[nameNode].y - 5,
  //         duration: 0.5
  //       })
  //     })
  //   }
  // }, [])

  useEffect(() => {
    if (step === -1) {
      let metaAntsTemp = {}
      setMetaAnts({})
      const startNode = Object.keys(state).filter(
        obj => state[obj].type === -1
      )[0]
      let i = 0
      while (++i <= countAnts) {
        metaAntsTemp['L' + i] = { ...state[startNode], cur: startNode }
        const antMeta = layRef.current.children.filter(
          obj => obj.name() === 'L' + i + '_circle'
        )
        const antTextMeta = layRef.current.children.filter(
          obj => obj.name() === 'L' + i + '_text'
        )
        if (antMeta.length) antMeta[0].destroy()
        if (antTextMeta.length) antTextMeta[0].destroy()
      }
      setUpdate(update + 1)
      setMetaAnts(metaAntsTemp)
    } else if (step < ants.length && step > -1) {
      const childrenLay = layRef.current.children
      ants[step].forEach(way => {
        const [nameAnt, nameNode] = way.split('-')
        const antMeta = childrenLay.filter(
          obj => obj.name() === nameAnt + '_circle'
        )[0]
        if (antMeta) {
          antMeta.to({
            // zIndex: 1,
            x: state[nameNode].x,
            y: state[nameNode].y,
            duration: 0.5
          })
          const antTextMeta = childrenLay.filter(
            obj => obj.name() === nameAnt + '_text'
          )[0]
          antTextMeta.to({
            // zIndex: 1,
            x: state[nameNode].x - 5,
            y: state[nameNode].y - 5,
            duration: 0.5
          })
        }
      })
    }
  }, [step])

  const updateMetaAnts = () => {
    if (Object.keys(metaAnts).length) {
      let metaAntsTemp = {}
      Object.keys(metaAnts).forEach(nameAnt => {
        metaAntsTemp[nameAnt] = {
          ...metaAnts[nameAnt],
          ...state[metaAnts[nameAnt].cur]
        }
      })
      setMetaAnts(metaAntsTemp)
    }
  }

  useEffect(() => {
    if (Object.keys(metaAnts).length > -1) {
      updateMetaAnts()
      setStep(-1)
    }
  }, [state])

  const handleDrag = e => {
    setState({
      ...state,
      [e.target.name()]: {
        ...e.target.position(),
        type: state[e.target.name()].type
      }
    })
  }

  const getLinks = () => {
    if (links) {
      return links.map(link => {
        return (
          <Line
            key={`line-${link[0]}-${link[1]}`}
            points={[
              state[link[0]].x,
              state[link[0]].y,
              state[link[1]].x,
              state[link[1]].y
            ]}
            stroke={grey[500]}
          />
        )
      })
    }
  }

  const getTextNode = () => {
    return Object.keys(state).map(nameState => {
      return (
        <Text
          {...state[nameState]}
          x={state[nameState].x - 6}
          y={state[nameState].y - 46}
          text={nameState}
          fill={'black'}
          fontSize={16}
          name={nameState}
        />
      )
    })
  }

  const getAntsCircle = () => {
    return Object.keys(metaAnts).map(nameState => {
      return (
        <Circle
          key={update + nameState + '_circle'}
          {...metaAnts[nameState]}
          radius={10}
          fill={brown[100]}
          shadowBlur={6}
          shadowColor={brown[500]}
          name={nameState + '_circle'}
        />
      )
    })
  }

  const getAntsText = () => {
    return Object.keys(metaAnts).map(nameState => {
      return (
        <Text
          key={update + nameState + '_text'}
          {...metaAnts[nameState]}
          x={metaAnts[nameState].x - 5}
          y={metaAnts[nameState].y - 5}
          text={nameState}
          fill={'black'}
          fontSize={10}
          name={nameState + '_text'}
        />
      )
    })
  }
  return (
    <Stage
      width={(width * 9) / 12 - 18}
      height={height - 80}
      // width={props.width?.current?.offsetWidth}
      // height={props.width?.current?.offsetHeight}
    >
      <Layer ref={layRef}>
        {getLinks()}

        {Object.keys(state).map(nameState => {
          return (
            <Circle
              {...state[nameState]}
              radius={30}
              fill={typeColor[String(state[nameState].type)][1]}
              shadowBlur={10}
              shadowColor={typeColor[String(state[nameState].type)][0]}
              name={nameState}
              draggable
              onDragMove={handleDrag}
            />
          )
        })}
        {getTextNode()}
        {getAntsCircle()}
        {getAntsText()}
      </Layer>
    </Stage>
  )
}

export default GraphLemin
