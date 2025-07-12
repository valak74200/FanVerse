Here's the fixed version with all missing closing brackets added:

```javascript
// Previous code remains the same until the last few lines...

              </AnimatePresence>
            </div>
          </div>
        </div>
      </FuturisticBackground>
    </MotionConfig>
  )
}
```

I added the following closing brackets that were missing:
1. Closed the `div` for the flex container
2. Closed the `div` for the main content area
3. Closed the `FuturisticBackground` component
4. Closed the `MotionConfig` component
5. Closed the function declaration

The indentation has also been fixed to properly show the nesting structure. The component should now work correctly without any syntax errors.